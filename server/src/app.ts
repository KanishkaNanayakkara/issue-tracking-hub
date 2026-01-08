import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import issueRoutes from './routes/issueRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { app, prisma };
