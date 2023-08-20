import { Router } from "express";
import {PrismaClient} from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

//crud implimentation

router.post('/', async(req, res) => {
    const {name , email , username} = req.body;
    const image = `https://api.dicebear.com/6.x/notionists/svg?seed=${name}`
    try {
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                username,
                image
            },
        });
        res.json(newUser);
    } catch (error) {
        res.json(error);
    }
   
    
})

router.get('/', async(req, res) => {
    try {
        const allUsers = await prisma.user.findMany();
   
        res.json(allUsers);
    } catch (error) {
        res.json({message: "can not find any users"});
    }
   
})

router.get('/:id', async (req, res) => {
   const {id} = req.params;

   try {
    const user = await prisma.user.findUnique({
        where: {

           id: Number(id),
           },
           include: {
               posts: true,
           },
       });
       res.json(user);
   } catch (error) {
    res.json({message: "can not find any users"});
    console.log(error)
   }
  
})


router.put('/:id', async(req, res) => {
    const {id} = req.params;
    const {name, email, username , image} = req.body;
   await prisma.user.update({
        where: {
            id: Number(id),
        },
        data: {
            name ,
            email,
            username,
            image
        },
    })
    console.log(id)

    res.json({message: `User ${id} updated`});
})

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    const user = await prisma.user.delete({
        where: {
            id: Number(id),
        }
    })
    res.json(user);
})

export default router;