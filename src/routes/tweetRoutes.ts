import { Router } from "express";
import { PrismaClient } from "@prisma/client";


const router = Router();
const prisma = new PrismaClient();






router.post('/', async (req, res) => {
    const {content , image} = req.body;
    // @ts-ignore
    const user = req.user;

    try {
        const newTweet = await prisma.tweet.create({
            data: {
                content,
                userId: user.id, //todo : change this to session user id
                image
            },
        });
        res.json(newTweet);
    }
    catch (error) {
        res.json(error);
    }
    
});

router.get('/', async(req, res) => {
   try {
    const allTweets = await prisma.tweet.findMany({
        include: {
            user: true,
        },
    })
    res.json(allTweets);
   } catch (error) {
    res.json({message: "can not find any tweets"});
   }

})

router.get('/:id', async (req, res) => {
   const {id} = req.params;
   try {
   const tweet =  await prisma.tweet.findMany({
        where:{
            userId : Number(id)
            
        },
        include: {
            user: true,
        }

        
    }
    )
    res.json(tweet)
   } catch (error) {
    res.json({message: `can not find any tweets by id: ${id}`});
   }

})

router.put('/:id', async(req, res) => {
    const {id } = req.params;
    const {content, image} = req.body;
    try {
        const updatedTweet = await prisma.tweet.update({
            where: {
                id: Number(id),
            },
            data: {
                content,
                image
            },
        })
        res.json(updatedTweet);
    } catch (error) {
        res.json({message: `can not update tweet by id: ${id}`});
    }

})

router.delete('/:id', async(req, res) => {
    const {id} = req.params;
    try {
        const deletedTweet = await prisma.tweet.delete({
            where: {
                id: Number(id),
            },
        })
        res.json(deletedTweet);
        
    } catch (error) {
        res.json({message: `can not delete tweet by id: ${id}`})
    }
    
       
})

export default router;