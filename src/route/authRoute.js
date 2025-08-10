import express from 'express';
import * as authController from '../controller/authController.js';

const router = express.Router();

// POST /auth/register - Endpoint for user registration.
router.post('/register', authController.register);

// POST /auth/login - Endpoint for user login.
router.post('/login', authController.login);

// POST /auth/verify-account-request - Endpoint to send an OTP to the user's email.
router.post('/verify-account-request', authController.requestAccountVerification);

// POST /auth/verify-account - Endpoint to verify the OTP and activate the user's account.
router.post('/verify-account', authController.verifyAccount);

// POST /auth/password-reset-request - Endpoint to request a password reset token.
router.post('/password-reset-request', authController.requestPasswordReset);

// POST /auth/password-reset - Endpoint to reset the password using a token.
router.post('/password-reset', authController.resetPassword);

export default router;
