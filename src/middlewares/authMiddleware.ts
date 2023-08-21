import { Request, Response , NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { PrismaClient , User } from "@prisma/client";



const prisma = new PrismaClient();

const JWT_SECRET = 'secret';

type AuthRequest = Request & { user?: User };


export async function authenticateToken (req:AuthRequest , res:Response , next:NextFunction) {
   
    const authHeader = req.headers['authorization'];
    const jwtToken = authHeader?.split(' ')[1];
    if (!jwtToken) return res.sendStatus(401);

    try {
        const payLoad = await jwt.verify(jwtToken, JWT_SECRET) as { tokenId: number};
        const dbToken = await prisma.token.findUnique({
            where: {
                id: payLoad.tokenId,
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
        const user = dbToken.user;

        req.user = user;

    } catch (error) {
        res.sendStatus(401);
    }
    next();
}
