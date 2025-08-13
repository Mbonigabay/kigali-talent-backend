import Database from 'better-sqlite3';
import log4js from 'log4js';
import { initSeedData } from './dbSeeder.js';

const logger = log4js.getLogger('db');

// Create a single, shared database instance.
const db = new Database('./database.sqlite');
logger.info('Database connected successfully.');

// A method to create the 'users' table with all the new authentication fields.
const createUsersTable = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            state INTEGER NOT NULL CHECK (state IN (0, 1)),
            isLocked INTEGER NOT NULL CHECK (isLocked IN (0, 1)),
            lockedType TEXT CHECK (lockedType IN ('GENERAL', 'NOT_VERIFIED')),
            role TEXT NOT NULL CHECK (role IN ('ROLE_APPLICANT', 'ROLE_ADMIN'))
        )
    `);
    logger.info("'users' table created or already exists.");
};

// A method to create the 'companies' table.
const createCompaniesTable = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS companies (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            sector TEXT,
            location TEXT,
            website TEXT
        )
    `);
    logger.info("'companies' table created or already exists.");
};

// A method to create the 'jobs' table with all its constraints.
const createJobsTable = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            jobNumber TEXT NOT NULL UNIQUE,
            slug TEXT NOT NULL UNIQUE,
            state INTEGER NOT NULL CHECK (state IN (0, 1)),
            jobStatus TEXT NOT NULL CHECK (jobStatus IN ('created', 'published', 'closedForApplication', 'shortlisted', 'interview', 'offerSent', 'closed')),
            title TEXT NOT NULL,
            companyId TEXT NOT NULL,
            location TEXT,
            locationType TEXT CHECK (locationType IN ('onsite', 'remote')),
            dateCreated INTEGER NOT NULL,
            datePublished INTEGER,
            deadline INTEGER,
            jobType TEXT CHECK (jobType IN ('fulltime', 'partime', 'volunteer', 'contract', 'internship')),
            yearsOfExperienceNeed TEXT,
            numberOfOpenPosition INTEGER,
            description TEXT,
            FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
        )
    `);
    logger.info("'jobs' table created or already exists.");
};

// A new method to create the 'applicants' table.
const createApplicantsTable = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS applicants (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL UNIQUE,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            address TEXT,
            phoneNumber TEXT,
            email TEXT NOT NULL UNIQUE,
            linkedin TEXT,
            summary TEXT,
            skills TEXT,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    logger.info("'applicants' table created or already exists.");
};

// A new method to create the 'job_applications' table.
const createJobApplicationsTable = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS job_applications (
            id TEXT PRIMARY KEY,
            applicantId TEXT NOT NULL,
            jobId TEXT NOT NULL,
            state INTEGER NOT NULL CHECK (state IN (0, 1)),
            jobApplicationStatus TEXT NOT NULL CHECK (jobApplicationStatus IN ('submitted', 'shortlisted', 'interviewing', 'offer', 'hired', 'rejected')),
            dateCreated INTEGER NOT NULL,
            lastDateModified INTEGER NOT NULL,
            UNIQUE(applicantId, jobId),
            FOREIGN KEY (applicantId) REFERENCES applicants(id) ON DELETE CASCADE,
            FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE
        )
    `);
    logger.info("'job_applications' table created or already exists.");
};

// A method to create the 'verification_tokens' table.
const createVerificationTokensTable = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS verification_tokens (
            token TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            expiresAt INTEGER NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    logger.info("'verification_tokens' table created or already exists.");
};

// A new method to create the 'education' table.
const createEducationTable = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS education (
            id TEXT PRIMARY KEY,
            applicantId TEXT NOT NULL,
            school TEXT NOT NULL,
            levelOfEducation TEXT NOT NULL,
            fieldOfStudy TEXT,
            description TEXT,
            yearOfGraduation INTEGER,
            FOREIGN KEY (applicantId) REFERENCES applicants(id) ON DELETE CASCADE
        )
    `);
    logger.info("'education' table created or already exists.");
};

// A new method to create the 'experience' table.
const createExperienceTable = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS experience (
            id TEXT PRIMARY KEY,
            applicantId TEXT NOT NULL,
            companyName TEXT NOT NULL,
            role TEXT NOT NULL,
            startDate INTEGER NOT NULL,
            endDate INTEGER,
            description TEXT,
            FOREIGN KEY (applicantId) REFERENCES applicants(id) ON DELETE CASCADE
        )
    `);
    logger.info("'experience' table created or already exists.");
};

// A method to create the 'password_reset_tokens' table.
const createPasswordResetTokensTable = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            token TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            expiresAt INTEGER NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    logger.info("'password_reset_tokens' table created or already exists.");
};

/**
 * A dedicated function to initialize all necessary tables.
 * This function is now exported to be called from the main entry point.
 */
export const initializeDb = () => {
    try {
        createUsersTable();
        createCompaniesTable();
        createJobsTable();
        createApplicantsTable();
        createJobApplicationsTable();
        createVerificationTokensTable();
        createEducationTable();
        createExperienceTable();
        createPasswordResetTokensTable();
        logger.info('All database tables created or already exist.');
    } catch (error) {
        logger.error('Failed to initialize database tables:', error);
        throw error;
    }
};

// The db instance is exported but not yet initialized until the function is called.
export default db;
