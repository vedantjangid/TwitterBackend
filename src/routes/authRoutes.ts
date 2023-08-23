import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { sendEmailToken } from "../services/emailService";


const EMAIL_TOKEN_EXPIRATION_MINUTES = 30;
const AUTHENTICATION_TOKEN_EXPIRATION_HOURS = 24;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const router = Router();
const prisma = new PrismaClient();

function generatetoken() {
    return Math.floor(1000000 + Math.random() * 90000000000).toString()
}

function generateAuthToken(tokenId: Number): string {
    const jwtPayload = { tokenId };
    return jwt.sign(jwtPayload, JWT_SECRET , {
        algorithm: 'HS256',
        noTimestamp: true,
    });
}

router.post('/login', async (req, res) => {
    const {email} = req.body;

    try {
        const emailToken = generatetoken();
    const expiration = new Date(Date.now() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000);

    const createToken = await prisma.token.create({
        data: {
            type: 'EMAIL',
            emailToken,
            expiration,
            user: {
                connectOrCreate: {
                    where: {
                        email
                    },
                    create: {
                        email,
                    }
            }

        }}
    })
    
     await sendEmailToken(email, emailToken);

     console.log("email sent")
     res.json(createToken);
    
    } catch (error) {
        
        res.json({message: "can not find any users"});

    }


});


router.post('/authenticate', async (req, res) => {
    const {emailToken , email} = req.body;


        const dbToken = await prisma.token.findUnique({
            where: {
                emailToken,
            },
            include: {
                user: true,
            },
        });
        if (!dbToken || !dbToken.valid) {
            return res.status(401).json({message: "Invalid token"});
        }
        if (dbToken.expiration < new Date()) {
            return res.status(401).json({message: "Token expired"});
        }
        if (dbToken?.user?.email !== email) {
            return res.status(401).json({message: "Invalid email"});
        }

       
       
        const expiration = new Date(
            new Date().getTime() + AUTHENTICATION_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000
          );
          const apiToken = await prisma.token.create({
            data: {
              type: 'API',
              expiration,
              user: {
                connect: {
                  email,
                },
              },
            },
          });
            await prisma.token.update({
                where: {
                    id: dbToken.id,
                },
                data: {
                    valid: false,
                },
            });

            const authToken = generateAuthToken(apiToken.id);

                res.json(authToken);
    });





export default router;



