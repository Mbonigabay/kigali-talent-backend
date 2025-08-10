import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import log4js from 'log4js';
import * as userRepository from './userRepository.js';
import * as authRepository from './authRepository.js';
import * as applicantRepository from './applicantRepository.js';
import * as companyRepository from './companyRepository.js';
import * as jobRepository from './jobRepository.js';
import * as jobApplicationRepository from './jobApplicationRepository.js';

const logger = log4js.getLogger('dbSeeder');

// Define user constants
const USER_STATE = { ACTIVE: 1, INACTIVE: 0 };
const USER_ROLE = { APPLICANT: 'ROLE_APPLICANT', ADMIN: 'ROLE_ADMIN' };
const LOCK_TYPE = { GENERAL: 'GENERAL', NOT_VERIFIED: 'NOT_VERIFIED', NONE: null };

// Define job constants
const JOB_STATUS = { CREATED: 'created', PUBLISHED: 'published' };
const JOB_APPLICATION_STATUS = { SUBMITTED: 'submitted' };
const JOB_APPLICATION_STATE = { ACTIVE: 1 };

/**
 * Populates the database with initial data.
 */
export const initSeedData = () => {
    try {
        const existingUsers = userRepository.findAll();
        if (existingUsers.length > 0) {
            logger.info('Database is not empty. Skipping seeding.');
            return;
        }

        logger.info('Database is empty. Starting to seed data...');
        const users = [];
        const applicantProfiles = [];
        const companies = [];
        const jobs = [];
        const jobApplications = [];
        const hashedPassword = bcrypt.hashSync('Password@123', 10);

        // 1. Create one ADMIN user
        const adminUser = {
            id: uuidv4(),
            username: 'admin@kigalitalent.rw',
            password: hashedPassword,
            state: USER_STATE.ACTIVE,
            isLocked: 0,
            lockedType: LOCK_TYPE.NONE,
            role: USER_ROLE.ADMIN
        };
        authRepository.insert(adminUser);
        users.push(adminUser);

        // 2. Create five APPLICANT users and their profiles
        for (let i = 1; i <= 5; i++) {
            const applicantUser = {
                id: uuidv4(),
                username: `applicant${i}@example.com`,
                password: hashedPassword,
                state: USER_STATE.ACTIVE,
                isLocked: 0,
                lockedType: LOCK_TYPE.NONE,
                role: USER_ROLE.APPLICANT
            };
            authRepository.insert(applicantUser);
            users.push(applicantUser);

            const applicantProfile = {
                id: uuidv4(),
                userId: applicantUser.id,
                firstName: `Applicant`,
                lastName: `${i}`,
                address: `123 Applicant St.`,
                phoneNumber: `111-222-000${i}`,
                email: applicantUser.username,
                linkedin: `https://linkedin.com/in/applicant${i}`,
                summary: `Summary for applicant ${i}.`,
                skills: `Node.js, Express, JavaScript`
            };
            applicantRepository.insert(applicantProfile);
            applicantProfiles.push(applicantProfile);
        }

        // 3. Create five COMPANIES
        const companyNames = ['Google', 'Microsoft', 'Amazon', 'Irembo', 'Andela'];
        for (const name of companyNames) {
            const company = {
                id: uuidv4(),
                name,
                description: `Description for ${name}.`,
                sector: 'Technology',
                location: 'Kigali',
                website: `https://${name.toLowerCase()}.com`
            };
            companyRepository.insert(company);
            companies.push(company);
        }

        // 4. Create five JOBS
        const jobTitles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer'];
        for (let i = 0; i < jobTitles.length; i++) {
            const job = {
                id: uuidv4(),
                jobNumber: `JOB-${Date.now()}-${i}`,
                slug: `job-slug-${i}`,
                state: 1,
                jobStatus: JOB_STATUS.PUBLISHED,
                title: jobTitles[i],
                companyId: companies[i].id,
                location: 'Remote',
                locationType: 'remote',
                dateCreated: Date.now(),
                datePublished: Date.now(),
                deadline: Date.now() + 86400000 * 30, // 30 days from now
                jobType: 'fulltime',
                yearsOfExperienceNeed: '3-5',
                numberOfOpenPosition: 1
            };
            jobRepository.insert(job);
            jobs.push(job);
        }

        // 5. Create some JOB APPLICATIONS
        for (let i = 0; i < 3; i++) {
            const application = {
                id: uuidv4(),
                applicantId: applicantProfiles[i].id,
                jobId: jobs[i].id,
                state: JOB_APPLICATION_STATE.ACTIVE,
                jobApplicationStatus: JOB_APPLICATION_STATUS.SUBMITTED,
                dateCreated: Date.now(),
                lastDateModified: Date.now()
            };
            jobApplicationRepository.insert(application);
            jobApplications.push(application);
        }

        logger.info('Database seeding complete. All initial data has been added.');
    } catch (error) {
        console.log("error::", error)
        logger.error('Database seeding failed:', error);
    }
};
