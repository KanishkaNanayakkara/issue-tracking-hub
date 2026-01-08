import { Router } from 'express';
import { createIssue, deleteIssue, getIssueById, getIssues, updateIssue } from '../controllers/issueController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken); // Protect all issue routes

router.get('/', getIssues);
router.post('/', createIssue);
router.get('/:id', getIssueById);
router.put('/:id', updateIssue);
router.delete('/:id', deleteIssue);

export default router;
