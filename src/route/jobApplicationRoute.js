import express from 'express';
import * as jobApplicationController from '../controller/jobApplicationController.js';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Endpoint to apply for a job.
router.post('/:jobNumber/apply', authenticateJWT, authorizeRole('ROLE_APPLICANT'), jobApplicationController.applyForJob);

// Route to check a user's application status for a job (Authenticated users only).
router.get('/:jobId/status', authenticateJWT, jobApplicationController.getApplicationStatus);

// Middleware for routes accessible to admins only.
router.get('/jobs/:jobId', authenticateJWT, authorizeRole('ROLE_ADMIN'), jobApplicationController.getApplicationsByJobId);

// Route to get all applications for the authenticated user (Applicant only).
router.get('/my-applications', authenticateJWT, authorizeRole('ROLE_APPLICANT'), jobApplicationController.getMyApplications);

// Route to update a job application's status (Admin only).
router.put('/update-job-application/status', authenticateJWT, authorizeRole('ROLE_ADMIN'), jobApplicationController.updateJobApplicationStatus);

export default router;
