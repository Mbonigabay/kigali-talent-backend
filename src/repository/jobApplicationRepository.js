import db from './db.js';

/**
 * Inserts a new job application into the database.
 * @param {object} applicationData The job application data.
 * @returns {object} The newly created job application object.
 */
export const insert = (applicationData) => {
    const stmt = db.prepare(`
        INSERT INTO job_applications (id, applicantId, jobId, state, jobApplicationStatus, dateCreated, lastDateModified)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
        applicationData.id,
        applicationData.applicantId,
        applicationData.jobId,
        applicationData.state,
        applicationData.jobApplicationStatus,
        applicationData.dateCreated,
        applicationData.lastDateModified
    );
    return applicationData;
};


/**
 * Finds a job application by applicant ID and job ID.
 * @param {string} applicantId The applicant's ID.
 * @param {string} jobId The job's ID.
 * @returns {object|undefined} The job application object if found, otherwise undefined.
 */
 export const findByApplicantAndJobId = (applicantId, jobId) => {
    return db.prepare('SELECT * FROM job_applications WHERE applicantId = ? AND jobId = ?').get(applicantId, jobId);
};


/**
 * Finds all job applications for a specific job, including applicant profile details.
 * @param {string} jobId The ID of the job.
 * @returns {Array<object>} A list of job applications with joined applicant data.
 */
 export const findApplicationsByJobId = (jobId) => {
    return db.prepare(`
        SELECT
            ja.*,
            a.firstName, a.lastName, a.address, a.phoneNumber, a.email, a.linkedin, a.summary, a.skills
        FROM job_applications ja
        JOIN applicants a ON ja.applicantId = a.id
        WHERE ja.jobId = ?
    `).all(jobId);
};

/**
 * Finds a job application by its ID.
 * @param {string} id The application's ID.
 * @returns {object|undefined} The job application object if found.
 */
 export const findById = (id) => {
    return db.prepare('SELECT * FROM job_applications WHERE id = ?').get(id);
};

/**
 * Updates a job application's status.
 * @param {string} id The application's ID.
 * @param {string} newStatus The new status.
 */
 export const updateStatus = (id, newStatus) => {
    db.prepare('UPDATE job_applications SET jobApplicationStatus = ?, lastDateModified = ? WHERE id = ?')
        .run(newStatus, Date.now(), id);
};