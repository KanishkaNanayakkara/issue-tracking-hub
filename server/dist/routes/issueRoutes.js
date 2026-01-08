"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issueController_1 = require("../controllers/issueController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateToken); // Protect all issue routes
router.get('/', issueController_1.getIssues);
router.post('/', issueController_1.createIssue);
router.get('/:id', issueController_1.getIssueById);
router.put('/:id', issueController_1.updateIssue);
router.delete('/:id', issueController_1.deleteIssue);
exports.default = router;
