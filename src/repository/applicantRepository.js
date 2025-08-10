import db from './db.js';

/**
 * Inserts a new applicant profile into the database.
 * @param {object} applicantData The applicant data.
 * @returns {object} The newly created applicant object.
 */
export const insert = (applicantData) => {
    const stmt = db.prepare(`
        INSERT INTO applicants (id, userId, firstName, lastName, address, phoneNumber, email, linkedin, summary, skills)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
        applicantData.id,
        applicantData.userId,
        applicantData.firstName,
        applicantData.lastName,
        applicantData.address,
        applicantData.phoneNumber,
        applicantData.email,
        applicantData.linkedin,
        applicantData.summary,
        applicantData.skills
    );
    return applicantData;
};

/**
 * Finds an applicant profile by their user ID.
 * @param {string} userId The user's ID.
 * @returns {object|undefined} The applicant object if found, otherwise undefined.
 */
export const findByUserId = (userId) => {
    return db.prepare('SELECT * FROM applicants WHERE userId = ?').get(userId);
};
