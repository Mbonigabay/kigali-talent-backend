// This file defines the API routes for applicant profile management.

import express from 'express';
import * as applicantController from '../controller/applicantController.js';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to protect all routes in this router.
// Only authenticated users with the ROLE_APPLICANT role can access these.
router.use(authenticateJWT, authorizeRole('ROLE_APPLICANT'));

// Endpoint to create an applicant profile.
router.post('/profile', applicantController.createApplicantProfile);

export default router;
