import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authRepository from '../repository/authRepository.js';
import * as emailService from '../service/emailService.js';
import log4js from 'log4js';
const logger = log4js.getLogger('authService');

const USER_STATE = {
    ACTIVE: 1,
    INACTIVE: 0
};
const USER_ROLE = {
    APPLICANT: 'ROLE_APPLICANT',
    ADMIN: 'ROLE_ADMIN'
};
const LOCK_TYPE = {
    GENERAL: 'GENERAL',
    NOT_VERIFIED: 'NOT_VERIFIED',
    NONE: null
};

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1h'; 

/**
 * Registers a new user.
 * @param {string} username The user's email address.
 * @param {string} password The user's chosen password.
 * @returns {object} The newly registered user object without the password.
 */
export const register = (username, password) => {
    // Check if a user with this username already exists.
    if (authRepository.findByUsername(username)) {
        throw new Error('Username already exists.');
    }

    // Hash the password securely before storing it.
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create the user object with default values.
    const newUser = {
        id: uuidv4(),
        username,
        password: hashedPassword,
        state: USER_STATE.ACTIVE,
        isLocked: 1,
        lockedType: LOCK_TYPE.NOT_VERIFIED,
        role: USER_ROLE.APPLICANT
    };

    // Save the user to the database.
    authRepository.insert(newUser);

    // Return the user object, but remove the sensitive password.
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

/**
 * Handles user login and generates a JWT.
 * @param {string} username The user's email address.
 * @param {string} password The user's password.
 * @returns {string} The JWT if login is successful.
 */
 export const login = (username, password) => {
    const user = authRepository.findByUsername(username);

    // Check if the user exists.
    if (!user) {
        throw new Error('Invalid username or password.');
    }

    // Compare the provided password with the stored hashed password.
    if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('Invalid username or password.');
    }

    // Check if the user's account is locked.
    if (user.isLocked && user.lockedType === LOCK_TYPE.NOT_VERIFIED) {
        throw new Error(`Account is not verified.`);
    }else if (user.isLocked) {
        throw new Error(`Account is locked with type: ${user.lockedType}.`);
    }

    // Check if the user's account is active.
    if (user.state !== USER_STATE.ACTIVE) {
        throw new Error('Account is not active.');
    }

    // Create the JWT payload with user information.
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role
    };

    // Sign the token with the secret and set an expiration time.
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

/**
 * Requests an account verification OTP for a user.
 * @param {string} username The user's email address.
 */
 export const requestVerificationToken = (username) => {
    const user = authRepository.findByUsername(username);

    // Check if the user exists.
    if (!user) {
        throw new Error('User not found.');
    }

    // Check if the user is already active.
    if (user.state === USER_STATE.ACTIVE && !user.isLocked && user.lockedType === LOCK_TYPE.NOT_VERIFIED) {
        throw new Error('Account is already verified.');
    }
    
    // Generate a 6-digit OTP.
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes.

    // Store the token in the database.
    authRepository.insertToken({ token, userId: user.id, expiresAt });
    
    // Send the email to the user.
    const subject = 'Account Verification OTP';
    const text = `Your OTP for account verification is: ${token}. This token is valid for 10 minutes.`;
    emailService.sendEmail(user.username, subject, text);

    return { message: 'Verification OTP sent to your email.' };
};


/**
 * Verifies the OTP and activates the user's account.
 * @param {string} username The user's email address.
 * @param {string} token The OTP from the user.
 */
 export const verifyToken = (username, token) => {
    const user = authRepository.findByUsername(username);

    if (!user) {
        throw new Error('User not found.');
    }

    const storedToken = authRepository.findToken(token);

    // Check if the token is valid.
    if (!storedToken || storedToken.userId !== user.id || storedToken.expiresAt < Date.now()) {
        throw new Error('Invalid or expired token.');
    }

    // Update the user's state to active.
    authRepository.updateState(user.id, USER_STATE.ACTIVE);
    
    // Unlock the account
    authRepository.updateLockedState(user.id, 0, null);

    // Delete the token after successful verification.
    authRepository.deleteToken(token);
    
    return { message: 'Account verified successfully.' };
};

/**
 * Resets a user's password after token verification.
 * @param {string} username The user's email.
 * @param {string} token The password reset token.
 * @param {string} newPassword The new password provided by the user.
 */
 export const resetPassword = (username, token, newPassword) => {
    const user = authRepository.findByUsername(username);
    const storedToken = authRepository.findPasswordResetToken(token);

    // Check if the token is valid, not expired, and belongs to the user.
    if (!storedToken || storedToken.expiresAt < Date.now() || storedToken.userId !== user.id) {
        throw new Error('Invalid or expired password reset token.');
    }

    if (!user) {
        throw new Error('User not found.');
    }

    // Hash the new password securely.
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    
    // Update the user's password in the database.
    authRepository.updatePassword(user.id, hashedPassword);
    
    // Unlock the account if it was locked for a password reset
    if (user.isLocked && user.lockedType === LOCK_TYPE.GENERAL) {
        authRepository.updateLockedState(user.id, 0, null);
    }
    
    // Delete the token after a successful password reset.
    authRepository.deletePasswordResetToken(token);

    return { message: 'Password reset successfully.' };
};
