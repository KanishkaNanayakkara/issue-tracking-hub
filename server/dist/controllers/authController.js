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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const existingUser = yield app_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield app_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = yield app_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});
exports.login = login;
