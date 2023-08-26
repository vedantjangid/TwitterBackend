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
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers['authorization'];
        const jwtToken = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
        if (!jwtToken)
            return res.sendStatus(401);
        try {
            const payLoad = yield jsonwebtoken_1.default.verify(jwtToken, JWT_SECRET);
            const dbToken = yield prisma.token.findUnique({
                where: {
                    id: payLoad.tokenId,
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
            const user = dbToken.user;
            req.user = user;
        }
        catch (error) {
            res.sendStatus(401);
        }
        next();
    });
}
exports.authenticateToken = authenticateToken;
