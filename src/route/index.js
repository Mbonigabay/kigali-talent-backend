import express from 'express';
import userRoute from './userRoute.js';
import authRoute from './authRoute.js';
import jobRoute from './jobRoute.js';
import companyRoute from './companyRoute.js';
import applicantRoute from './applicantRoute.js';
import jobApplicationRoute from './jobApplicationRoute.js';

const router = express.Router();

router.use('/api/users', userRoute);

router.use('/api/auth', authRoute);

router.use('/api/jobs', jobRoute);

router.use('/api/companies', companyRoute);

router.use('/api/applicants', applicantRoute);

router.use('/api/job-applications', jobApplicationRoute);

export default router;
