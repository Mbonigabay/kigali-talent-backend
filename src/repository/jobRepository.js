// This repository is dedicated to database operations for jobs.

import db from './db.js';

/**
 * Inserts a new job into the database.
 * @param {object} jobData The job data.
 * @returns {object} The job object with its ID.
 */
export const insert = (jobData) => {
    const stmt = db.prepare(`
        INSERT INTO jobs (
            id, jobNumber, slug, state, jobStatus, title, companyId, location,
            locationType, dateCreated, datePublished, deadline, jobType,
            yearsOfExperienceNeed, numberOfOpenPosition, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
        jobData.id,
        jobData.jobNumber,
        jobData.slug,
        jobData.state,
        jobData.jobStatus,
        jobData.title,
        jobData.companyId,
        jobData.location,
        jobData.locationType,
        jobData.dateCreated,
        jobData.datePublished,
        jobData.deadline,
        jobData.jobType,
        jobData.yearsOfExperienceNeed,
        jobData.numberOfOpenPosition,
        jobData.description
    );
    return jobData;
};

/**
 * Finds all jobs with a 'published' status.
 * @returns {Array<object>} A list of published jobs.
 */
export const findAllPublished = () => {
    // Perform a JOIN with the companies table to get the company name.
    return db.prepare(`
        SELECT
            j.*,
            c.name AS companyName
        FROM jobs j
        JOIN companies c ON j.companyId = c.id
        WHERE j.jobStatus = ? AND j.state = 1
    `).all('published');
};

/**
 * Finds all jobs, regardless of status.
 * @returns {Array<object>} A list of all jobs.
 */
 export const findAll = () => {
    // Perform a JOIN with the companies table to get the company name.
    return db.prepare(`
        SELECT
            j.*,
            c.name AS companyName,
            (SELECT COUNT(*) FROM job_applications WHERE jobId = j.id) AS applicationsCount
        FROM jobs j
        JOIN companies c ON j.companyId = c.id
    `).all();
};

/**
 * Finds a job by its unique slug.
 * @param {string} slug The job's slug.
 * @returns {object|undefined} The job object if found, otherwise undefined.
 */
 export const findBySlug = (slug) => {
    // Perform a JOIN with the companies table to get the company name.
    return db.prepare(`
        SELECT
            j.*,
            c.name AS companyName,
            (SELECT COUNT(*) FROM job_applications WHERE jobId = j.id) AS applicationsCount
        FROM jobs j
        JOIN companies c ON j.companyId = c.id
        WHERE j.slug = ?
    `).get(slug);
};


/**
 * Finds a job by its ID.
 * @param {string} id The job's ID.
 * @returns {object|undefined} The job object if found, otherwise undefined.
 */
 export const findById = (id) => {
    // Perform a JOIN with the companies table to get the company name.
    return db.prepare(`
        SELECT
            j.*,
            c.name AS companyName
        FROM jobs j
        JOIN companies c ON j.companyId = c.id
        WHERE j.id = ?
    `).get(id);
};

/**
 * Finds a job by its unique job number.
 * @param {string} jobNumber The job's number.
 * @returns {object|undefined} The job object if found, otherwise undefined.
 */
export const findByJobNumber = (jobNumber) => {
    // Perform a JOIN with the companies table to get the company name.
    return db.prepare(`
        SELECT
            j.*,
            c.name AS companyName
        FROM jobs j
        JOIN companies c ON j.companyId = c.id
        WHERE j.jobNumber = ?
    `).get(jobNumber);
};

/**
 * Updates a job's status, optionally setting a publish date and deadline.
 * @param {string} jobNumber The job's unique number.
 * @param {string} newStatus The new job status.
 * @param {number} datePublished The timestamp for when the job was published (optional).
 * @param {number} deadline The timestamp for the application deadline (optional).
 */
export const updateJobStatus = (jobNumber, newStatus, datePublished, deadline) => {
    let query = 'UPDATE jobs SET jobStatus = ?, deadline = ? WHERE jobNumber = ?';
    let params = [newStatus, deadline, jobNumber];

    if (datePublished) {
        query = 'UPDATE jobs SET jobStatus = ?, datePublished = ?, deadline = ? WHERE jobNumber = ?';
        params = [newStatus, datePublished, deadline, jobNumber];
    }
    
    db.prepare(query).run(...params);
};
