import db from './db.js';

/**
 * Inserts a new user into the database.
 * @param {object} userData An object containing all user data.
 * @returns {object} The newly created user object.
 */
export const insert = (userData) => {
    // The `state` and `isLocked` fields are stored as integers (0 or 1).
    const stmt = db.prepare(`
        INSERT INTO users (id, username, password, state, isLocked, lockedType, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
        userData.id,
        userData.username,
        userData.password,
        userData.state,
        userData.isLocked,
        userData.lockedType,
        userData.role
    );
    return userData;
};

/**
 * Finds a user by their username (email).
 * @param {string} username The user's email address.
 * @returns {object|undefined} The user object if found, otherwise undefined.
 */
export const findByUsername = (username) => {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
};

/**
 * Finds a user by their ID.
 * @param {string} id The user's ID.
 * @returns {object|undefined} The user object if found, otherwise undefined.
 */
export const findById = (id) => {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
};

/**
 * Updates a user's state.
 * @param {string} userId The ID of the user to update.
 * @param {number} state The new state (1 for active, 0 for inactive).
 */
export const updateState = (userId, state) => {
    db.prepare('UPDATE users SET state = ? WHERE id = ?').run(state, userId);
};

/**
 * Updates a user's locked status and locked type.
 * @param {string} userId The ID of the user to update.
 * @param {number} isLocked The new locked status (1 for locked, 0 for unlocked).
 * @param {string|null} lockedType The new locked type, or null.
 */
export const updateLockedState = (userId, isLocked, lockedType) => {
    db.prepare('UPDATE users SET isLocked = ?, lockedType = ? WHERE id = ?')
        .run(isLocked, lockedType, userId);
};

/**
 * Updates a user's password.
 * @param {string} userId The ID of the user to update.
 * @param {string} newPassword The new hashed password.
 */
export const updatePassword = (userId, newPassword) => {
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newPassword, userId);
};

/**
 * Inserts a new verification token.
 * @param {object} tokenData An object with token details.
 */
export const insertToken = (tokenData) => {
    db.prepare('INSERT INTO verification_tokens (token, userId, expiresAt) VALUES (?, ?, ?)')
      .run(tokenData.token, tokenData.userId, tokenData.expiresAt);
};

/**
 * Finds a verification token by its value.
 * @param {string} token The token value to find.
 * @returns {object|undefined} The token object if found, otherwise undefined.
 */
export const findToken = (token) => {
    return db.prepare('SELECT * FROM verification_tokens WHERE token = ?').get(token);
};

/**
 * Deletes a verification token by its value.
 * @param {string} token The token value to delete.
 */
export const deleteToken = (token) => {
    db.prepare('DELETE FROM verification_tokens WHERE token = ?').run(token);
};

/**
 * Inserts a new password reset token.
 * @param {object} tokenData An object with token details.
 */
export const insertPasswordResetToken = (tokenData) => {
    db.prepare('INSERT INTO password_reset_tokens (token, userId, expiresAt) VALUES (?, ?, ?)')
        .run(tokenData.token, tokenData.userId, tokenData.expiresAt);
};

/**
 * Finds a password reset token by its value.
 * @param {string} token The token value to find.
 * @returns {object|undefined} The token object if found, otherwise undefined.
 */
export const findPasswordResetToken = (token) => {
    return db.prepare('SELECT * FROM password_reset_tokens WHERE token = ?').get(token);
};

/**
 * Deletes a password reset token by its value.
 * @param {string} token The token value to delete.
 */
export const deletePasswordResetToken = (token) => {
    db.prepare('DELETE FROM password_reset_tokens WHERE token = ?').run(token);
};
