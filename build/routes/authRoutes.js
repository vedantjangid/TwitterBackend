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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailService_1 = require("../services/emailService");
const EMAIL_TOKEN_EXPIRATION_MINUTES = 30;
const AUTHENTICATION_TOKEN_EXPIRATION_HOURS = 24;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
function generatetoken() {
    return Math.floor(100000 + Math.random() * 9000).toString();
}
function generateAuthToken(tokenId) {
    const jwtPayload = { tokenId };
    return jsonwebtoken_1.default.sign(jwtPayload, JWT_SECRET, {
        algorithm: 'HS256',
        noTimestamp: true,
    });
}
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const emailToken = generatetoken();
        const expiration = new Date(Date.now() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000);
        const createToken = yield prisma.token.create({
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
                }
            }
        });
        yield (0, emailService_1.sendEmailToken)(email, emailToken);
        console.log("email sent");
        res.json(createToken);
    }
    catch (error) {
        res.json({ message: "can not find any users" });
    }
}));
router.post('/authenticate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { emailToken, email } = req.body;
    const dbToken = yield prisma.token.findUnique({
        where: {
            emailToken,
        },
        include: {
            user: true,
        },
    });
    if (!dbToken || !dbToken.valid) {
        return res.status(401).json({ message: "Invalid token" });
    }
    if (dbToken.expiration < new Date()) {
        return res.status(401).json({ message: "Token expired" });
    }
    if (((_a = dbToken === null || dbToken === void 0 ? void 0 : dbToken.user) === null || _a === void 0 ? void 0 : _a.email) !== email) {
        return res.status(401).json({ message: "Invalid email" });
    }
    const expiration = new Date(new Date().getTime() + AUTHENTICATION_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000);
    const apiToken = yield prisma.token.create({
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
    yield prisma.token.update({
        where: {
            id: dbToken.id,
        },
        data: {
            valid: false,
        },
    });
    const authToken = generateAuthToken(apiToken.id);
    res.json(authToken);
}));
exports.default = router;
