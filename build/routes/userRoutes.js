"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
//crud implimentation
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, username } = req.body;
    const image = `https://api.dicebear.com/6.x/notionists/jpg?seed=${username}&width=285&height=285`;
    try {
        const newUser = yield prisma.user.create({
            data: {
                name,
                email,
                username,
                image
            },
        });
        res.json(newUser);
    }
    catch (error) {
        res.json(error);
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield prisma.user.findMany();
        res.json(allUsers);
    }
    catch (error) {
        res.json({ message: "can not find any users" });
    }
}));
// router.get('/:id', async (req, res) => {
//    const {id} = req.params;
//    try {
//     const user = await prisma.user.findUnique({
//         where: {
//            id: Number(id),
//            },
//            include: {
//                posts: true,
//            },
//        });
//        res.json(user);
//    } catch (error) {
//     res.json({message: "can not find any user"});
//     console.log(error)
//    }
// })
router.get('/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                posts: true,
            },
        });
        res.json(user);
    }
    catch (error) {
        res.json({ message: "can not find any user" });
        console.log(error);
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, username, image } = req.body;
    yield prisma.user.update({
        where: {
            id: Number(id),
        },
        data: {
            name,
            email,
            username,
            image
        },
    });
    console.log(id);
    res.json({ message: `User ${id} updated` });
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.user.delete({
        where: {
            id: Number(id),
        }
    });
    res.json(user);
}));
exports.default = router;
