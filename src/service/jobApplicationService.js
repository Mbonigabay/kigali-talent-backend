// This service layer contains the business logic for managing job applications.

import { v4 as uuidv4 } from 'uuid';
import log4js from 'log4js';
import * as jobApplicationRepository from '../repository/jobApplicationRepository.js';
import * as applicantRepository from '../repository/applicantRepository.js';
import * as jobRepository from '../repository/jobRepository.js';
import { toDateString } from '../util/date.js';
import { JOB_APPLICATION_STATUS, changeJobApplicationState } from '../stateMachine/jobApplicationStateMachine.js';

const logger = log4js.getLogger('jobApplicationService');

const JOB_APPLICATION_STATE = {
    ACTIVE: 1,
    INACTIVE: 0
};

/**
 * Allows an applicant to apply for a job.
 * @param {string} userId The ID of the user applying.
 * @param {string} jobId The ID of the job they are applying for.
 * @returns {object} The newly created job application.
 */
export const applyForJob = (userId, jobNumber) => {
    const applicant = applicantRepository.findByUserId(userId);
    if (!applicant) {
        throw new Error('Applicant profile not found. Please create a profile first.');
    }

    const job = jobRepository.findByJobNumber(jobNumber);
    if (!job) {
        throw new Error('Job not found.');
    }

    const existingApplication = jobApplicationRepository.findByApplicantAndJobId(applicant.id, job.id);
    if (existingApplication) {
        throw new Error('You have already applied for this job.');
    }

    const newApplication = {
        id: uuidv4(),
        applicantId: applicant.id,
        jobId: job.id,
        state: JOB_APPLICATION_STATE.ACTIVE,
        jobApplicationStatus: JOB_APPLICATION_STATUS.SUBMITTED,
        dateCreated: Date.now(),
        lastDateModified: Date.now()
    };

    jobApplicationRepository.insert(newApplication);

    return {
        ...newApplication,
        dateCreated: toDateString(newApplication.dateCreated),
        lastDateModified: toDateString(newApplication.lastDateModified)
    };
};


/**
 * Retrieves all job applications for a specific job, including applicant profiles.
 * @param {string} jobId The ID of the job.
 * @returns {Array<object>} A list of applications with formatted dates.
 */
 export const getApplicationsForJob = (jobId) => {
    const applications = jobApplicationRepository.findApplicationsByJobId(jobId);
    
    // Format dates before returning the data.
    return applications.map(app => ({
        ...app,
        dateCreated: toDateString(app.dateCreated),
        lastDateModified: toDateString(app.lastDateModified)
    }));
};

/**
 * Updates a job application's status based on a specific action.
 * @param {string} jobApplicationId The ID of the job application.
 * @param {string} action The event to trigger the status change (e.g., 'VIEW').
 * @returns {object} An object with a success message.
 */
 export const updateJobApplicationStatus = (jobApplicationId, action) => {
    const application = jobApplicationRepository.findById(jobApplicationId);

    if (!application) {
        throw new Error('Job application not found.');
    }

    const nextState = changeJobApplicationState(application.jobApplicationStatus, action);

    jobApplicationRepository.updateStatus(application.id, nextState);
    return { message: `Job application status updated to ${nextState}.` };
};