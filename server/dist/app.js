"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const issueRoutes_1 = __importDefault(require("./routes/issueRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/issues', issueRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
