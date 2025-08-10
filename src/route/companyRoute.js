import express from 'express';
import * as companyController from '../controller/companyController.js';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication and authorization middleware to all company routes.
// The authorizeRole middleware ensures only an 'ADMIN' can access these.
router.use(authenticateJWT, authorizeRole('ROLE_ADMIN'));

// CRUD routes for company management.
router.post('/', companyController.createCompany);
router.get('/', companyController.getCompanies);
router.get('/:id', companyController.getCompanyById);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

export default router;
