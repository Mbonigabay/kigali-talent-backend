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

            // Add education and experience for each applicant
            applicantRepository.insertEducation({
                id: uuidv4(),
                applicantId: applicantProfile.id,
                school: `University of Test ${i}`,
                levelOfEducation: 'Bachelor\'s Degree',
                fieldOfStudy: 'Computer Science',
                description: 'Graduated with honors.',
                yearOfGraduation: 2020 + i
            });
            applicantRepository.insertExperience({
                id: uuidv4(),
                applicantId: applicantProfile.id,
                companyName: `Test Company ${i}`,
                role: 'Junior Developer',
                startDate: new Date('2021-01-01').getTime(),
                endDate: new Date('2023-01-01').getTime(),
                description: 'Worked on various projects.'
            });
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
        const jobDescriptions = [
            'We are looking for a skilled Software Engineer to join our team.',
            'Join our data science team to analyze and interpret complex data.',
            'As a Product Manager, you will be responsible for a product lifecycle from conception to launch.',
            'We are seeking a talented UX Designer to create amazing user experiences.',
            'Join our DevOps team to help us build and maintain our infrastructure.'
        ];
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
                numberOfOpenPosition: 1,
                description: jobDescriptions[i]
            };
            jobRepository.insert(job);
            jobs.push(job);
        }

        // 5. Create some JOB APPLICATIONS
        for (let i = 0; i < jobs.length; i++) {
            const application = {
                id: uuidv4(),
                applicantId: applicantProfiles[i % applicantProfiles.length].id,
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
        logger.error('Database seeding failed:', error);
    }
};
