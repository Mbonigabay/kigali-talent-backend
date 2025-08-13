import express from 'express';
import * as companyController from '../controller/companyController.js';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', companyController.getCompanies);

router.get('/:id', companyController.getCompanyById);

router.use(authenticateJWT, authorizeRole('ROLE_ADMIN'));

// CRUD routes for company management.
router.post('/', companyController.createCompany);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

export default router;
