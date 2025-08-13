import * as authService from '../service/authService.js';
import { sendResponse } from '../util/response.js';
import log4js from 'log4js';
const logger = log4js.getLogger('authController');

/**
 * Handles the registration of a user
 * Endpoint: POST /auth/register
 */
export const register = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return sendResponse(res, 400, 'Username and password are required.', null);
    }

    try {
        const newUser = authService.register(username, password);
        sendResponse(res, 201, 'User registered successfully.', newUser);
    } catch (error) {
        logger.error('Registration failed:', error);
        sendResponse(res, 409, 'Username already exists.', null);
    }
};

/**
 * Handles the login of a user and returns a JWT.
 * Endpoint: POST /auth/login
 */
 export const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return sendResponse(res, 400, 'Username and password are required.', null);
    }

    try {
        const token = authService.login(username, password);
        sendResponse(res, 200, 'Login successful.', { token });
    } catch (error) {
        logger.error('Login failed:', error);
        sendResponse(res, 400, error.message, null);
    }
};

/**
 * Endpoint to verify the OTP and activate the user's account.
 * Endpoint: POST /auth/verify-account
 */
export const requestAccountVerification = (req, res) => {
    const { username } = req.body;

    if (!username) {
        return sendResponse(res, 400, 'Username is required.', null);
    }

    try {
        const response = authService.requestVerificationToken(username);
        sendResponse(res, 200, response.message, null);
    } catch (error) {
        logger.error('Verification request failed:', error);
        sendResponse(res, 400, error.message, null);
    }
};

/**
 * Endpoint to send an OTP to the user's email.
 * Endpoint: POST /auth/verify-account-request
 */
export const verifyAccount = (req, res) => {
    const { username, token } = req.body;

    if (!username || !token) {
        return sendResponse(res, 400, 'Username and token are required.', null);
    }

    try {
        const response = authService.verifyToken(username, token);
        sendResponse(res, 200, response.message, null);
    } catch (error) {
        logger.error('Account verification failed:', error);
        sendResponse(res, 400, error.message, null);
    }
};

/**
 * Handles the request for a password reset token.
 * Endpoint: POST /auth/password-reset-request
 */
 export const requestPasswordReset = (req, res) => {
    const { username } = req.body;
    if (!username) {
        return sendResponse(res, 400, 'Username is required.', null);
    }

    try {
        const response = authService.requestPasswordReset(username);
        sendResponse(res, 200, response.message, null);
    } catch (error) {
        logger.error('Password reset request failed:', error);
        sendResponse(res, 400, error.message, null);
    }
};

/**
 * Handles the password reset with a new password and token.
 * Endpoint: POST /auth/password-reset
 */
 export const resetPassword = (req, res) => {
    const { username, token, newPassword } = req.body;
    if (!username || !token || !newPassword) {
        return sendResponse(res, 400, 'Username, token, and newPassword are required.', null);
    }

    try {
        const response = authService.resetPassword(username, token, newPassword);
        sendResponse(res, 200, response.message, null);
    } catch (error) {
        logger.error('Password reset failed:', error);
        sendResponse(res, 400, error.message, null);
    }
};
