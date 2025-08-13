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


/**
 * Inserts a new education entry for an applicant.
 * @param {object} educationData The education data.
 * @returns {object} The newly created education entry.
 */
 export const insertEducation = (educationData) => {
    const stmt = db.prepare(`
        INSERT INTO education (id, applicantId, school, levelOfEducation, fieldOfStudy, description, yearOfGraduation)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
        educationData.id,
        educationData.applicantId,
        educationData.school,
        educationData.levelOfEducation,
        educationData.fieldOfStudy,
        educationData.description,
        educationData.yearOfGraduation
    );
    return educationData;
};

/**
 * Finds all education entries for a specific applicant.
 * @param {string} applicantId The ID of the applicant.
 * @returns {Array<object>} A list of education entries.
 */
export const findEducationByApplicantId = (applicantId) => {
    return db.prepare('SELECT * FROM education WHERE applicantId = ?').all(applicantId);
};



/**
 * Inserts a new experience entry for an applicant.
 * @param {object} experienceData The experience data.
 * @returns {object} The newly created experience entry.
 */
 export const insertExperience = (experienceData) => {
    const stmt = db.prepare(`
        INSERT INTO experience (id, applicantId, companyName, role, startDate, endDate, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
        experienceData.id,
        experienceData.applicantId,
        experienceData.companyName,
        experienceData.role,
        experienceData.startDate,
        experienceData.endDate,
        experienceData.description
    );
    return experienceData;
};


/**
 * Finds all experience entries for a specific applicant.
 * @param {string} applicantId The ID of the applicant.
 * @returns {Array<object>} A list of experience entries.
 */
 export const findExperienceByApplicantId = (applicantId) => {
    return db.prepare('SELECT * FROM experience WHERE applicantId = ?').all(applicantId);
};
