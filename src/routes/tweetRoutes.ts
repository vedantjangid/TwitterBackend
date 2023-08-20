import { Router } from "express";
import { PrismaClient } from "@prisma/client";


const router = Router();
const prisma = new PrismaClient();




router.post('/', (req, res) => {
    res.status(501).json({status: 'not implemented tweet'});
})

router.get('/', (req, res) => {
   
    res.status(501).json({status: `not implemented`});
})

router.get('/:id', (req, res) => {
   const {id} = req.params;
     res.status(501).json({status: `not implemented ${id}`});
})

router.put('/:id', (req, res) => {
    const {id} = req.params;
    res.status(501).json({status: `not implemented ${id}`});
})

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    
        res.status(501).json({status: `not implemented ${id}`});
})

export default router;