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
exports.getIssueById = exports.deleteIssue = exports.updateIssue = exports.createIssue = exports.getIssues = void 0;
const app_1 = require("../app");
const getIssues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, priority, search } = req.query;
        const whereClause = {};
        if (status)
            whereClause.status = status;
        if (priority)
            whereClause.priority = priority;
        if (search) {
            whereClause.OR = [
                { title: { contains: String(search), mode: 'insensitive' } },
                { description: { contains: String(search), mode: 'insensitive' } },
            ];
        }
        // Optional: restrict to user's issues? Or all issues? Req says "View a list of all issues".
        // I'll leave it as all issues for now, maybe add userId filter if needed.
        const issues = yield app_1.prisma.issue.findMany({
            where: whereClause,
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(issues);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch issues' });
    }
});
exports.getIssues = getIssues;
const createIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, status, priority } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }
        const issue = yield app_1.prisma.issue.create({
            data: {
                title,
                description,
                status,
                priority,
                userId,
            },
        });
        res.status(201).json(issue);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create issue' });
    }
});
exports.createIssue = createIssue;
const updateIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, status, priority } = req.body;
        const issue = yield app_1.prisma.issue.update({
            where: { id },
            data: { title, description, status, priority },
        });
        res.json(issue);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update issue' });
    }
});
exports.updateIssue = updateIssue;
const deleteIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield app_1.prisma.issue.delete({ where: { id } });
        res.json({ message: 'Issue deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete issue' });
    }
});
exports.deleteIssue = deleteIssue;
const getIssueById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const issue = yield app_1.prisma.issue.findUnique({
            where: { id },
            include: { user: { select: { name: true, email: true } } },
        });
        if (!issue)
            return res.status(404).json({ error: 'Issue not found' });
        res.json(issue);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch issue' });
    }
});
exports.getIssueById = getIssueById;
