import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });

        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });

        res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
