import express from 'express';
import * as applicantController from '../controller/applicantController.js';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to protect all routes in this router.
// Only authenticated users with the ROLE_APPLICANT role can access these.
router.use(authenticateJWT, authorizeRole('ROLE_APPLICANT'));

// Endpoint to create an applicant profile.
router.post('/profile', applicantController.createApplicantProfile);

// Endpoint to get the authenticated user's profile.
router.get('/profile', applicantController.getApplicantProfile);

// Endpoint to create a new education entry.
router.post('/education', applicantController.createEducation);

// Endpoint to get all education entries for the user.
router.get('/education', applicantController.getEducation);

// Endpoint to create a new experience entry.
router.post('/experience', applicantController.createExperience);

// Endpoint to get all experience entries for the user.
router.get('/experience', applicantController.getExperience);

export default router;
