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
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, image } = req.body;
    // @ts-ignore
    const user = req.user;
    try {
        const newTweet = yield prisma.tweet.create({
            data: {
                content,
                userId: user.id,
                image
            },
            include: {
                user: true,
            }
        });
        res.json(newTweet);
    }
    catch (error) {
        res.json(error);
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTweets = yield prisma.tweet.findMany({
            include: {
                user: true,
            },
        });
        res.json(allTweets);
    }
    catch (error) {
        res.json({ message: "can not find any tweets" });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("querying tweet by id", id);
    try {
        const tweet = yield prisma.tweet.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                user: true,
            }
        });
        res.json(tweet);
    }
    catch (error) {
        res.json({ message: `can not find any tweets by id: ${id}` });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { content, image } = req.body;
    try {
        const updatedTweet = yield prisma.tweet.update({
            where: {
                id: Number(id),
            },
            data: {
                content,
                image
            },
        });
        res.json(updatedTweet);
    }
    catch (error) {
        res.json({ message: `can not update tweet by id: ${id}` });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedTweet = yield prisma.tweet.delete({
            where: {
                id: Number(id),
            },
        });
        res.json(deletedTweet);
    }
    catch (error) {
        res.json({ message: `can not delete tweet by id: ${id}` });
    }
}));
exports.default = router;
