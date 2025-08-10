import express from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware.js';
import { getUsers } from '../controller/userController.js';

const router = express.Router();

router.get('/', authenticateJWT, authorizeRole('ROLE_ADMIN'), getUsers);

export default router;
