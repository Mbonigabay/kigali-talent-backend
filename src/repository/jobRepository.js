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
            yearsOfExperienceNeed, numberOfOpenPosition
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        jobData.numberOfOpenPosition
    );
    return jobData;
};

/**
 * Finds all jobs with a 'published' status.
 * @returns {Array<object>} A list of published jobs.
 */
export const findAllPublished = () => {
    return db.prepare('SELECT * FROM jobs WHERE jobStatus = ? AND state = 1').all('published');
};

/**
 * Finds all jobs, regardless of status.
 * @returns {Array<object>} A list of all jobs.
 */
 export const findAll = () => {
    return db.prepare('SELECT * FROM jobs').all();
};

/**
 * Finds a job by its unique slug.
 * @param {string} slug The job's slug.
 * @returns {object|undefined} The job object if found, otherwise undefined.
 */
export const findBySlug = (slug) => {
    return db.prepare('SELECT * FROM jobs WHERE slug = ?').get(slug);
};

/**
 * Finds a job by its unique job number.
 * @param {string} jobNumber The job's number.
 * @returns {object|undefined} The job object if found, otherwise undefined.
 */
 export const findByJobNumber = (jobNumber) => {
    return db.prepare('SELECT * FROM jobs WHERE jobNumber = ?').get(jobNumber);
};

/**
 * Updates a job's status, optionally setting a publish date and deadline.
 * @param {string} jobNumber The job's unique number.
 * @param {string} newStatus The new job status.
 * @param {number} datePublished The timestamp for when the job was published (optional).
 */
export const updateJobStatus = (jobNumber, newStatus, datePublished) => {
    let query = 'UPDATE jobs SET jobStatus = ? WHERE jobNumber = ?';
    let params = [newStatus, jobNumber];

    if (datePublished) {
        query = 'UPDATE jobs SET jobStatus = ?, datePublished = ? WHERE jobNumber = ?';
        params = [newStatus, datePublished, jobNumber];
    }
    
    db.prepare(query).run(...params);
};