import express from 'express';
import * as jobController from '../controller/jobController.js';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new job (Admin only)
router.post('/', authenticateJWT, authorizeRole('ROLE_ADMIN'), jobController.createJob);

// Route to get all published jobs (Public access)
router.get('/', jobController.getPublishedJobs);

// Route to get all jobs (Admin only)
router.get('/all', authenticateJWT, authorizeRole('ROLE_ADMIN'), jobController.getAllJobs);

// Route to get a single job by its slug (Public access)
router.get('/:slug', jobController.getJobBySlug);

// Route to get a single job by its ID (Admin only)
router.get('/id/:id', authenticateJWT, authorizeRole('ROLE_ADMIN'), jobController.getJobById);

// Route to update a job's status (Admin only)
router.put('/update-job/status', authenticateJWT, authorizeRole('ROLE_ADMIN'), jobController.updateJobStatus);

export default router;
