import { Request, Response } from 'express';
import { prisma } from '../app';
import { AuthRequest } from '../middleware/authMiddleware';

export const getIssues = async (req: AuthRequest, res: Response) => {
    try {
        const { status, priority, search } = req.query;

        const whereClause: any = {};
        if (status) whereClause.status = status;
        if (priority) whereClause.priority = priority;
        if (search) {
            whereClause.OR = [
                { title: { contains: String(search), mode: 'insensitive' } },
                { description: { contains: String(search), mode: 'insensitive' } },
            ];
        }
        // Optional: restrict to user's issues? Or all issues? Req says "View a list of all issues".
        // I'll leave it as all issues for now, maybe add userId filter if needed.

        const issues = await prisma.issue.findMany({
            where: whereClause,
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(issues);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch issues' });
    }
};

export const createIssue = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status, priority } = req.body;
        const userId = req.user?.userId;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const issue = await prisma.issue.create({
            data: {
                title,
                description,
                status,
                priority,
                userId,
            },
        });
        res.status(201).json(issue);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create issue' });
    }
};

export const updateIssue = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority } = req.body;

        const issue = await prisma.issue.update({
            where: { id },
            data: { title, description, status, priority },
        });
        res.json(issue);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update issue' });
    }
};

export const deleteIssue = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.issue.delete({ where: { id } });
        res.json({ message: 'Issue deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete issue' });
    }
};

export const getIssueById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const issue = await prisma.issue.findUnique({
            where: { id },
            include: { user: { select: { name: true, email: true } } },
        });
        if (!issue) return res.status(404).json({ error: 'Issue not found' });
        res.json(issue);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch issue' });
    }
}
