import express from 'express';
import userRoute from './userRoute.js';

const router = express.Router();

router.use('/api/users', userRoute);


export default router;
