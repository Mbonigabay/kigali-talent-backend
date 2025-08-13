import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import log4js from 'log4js';
import * as jobRepository from '../repository/jobRepository.js';
import * as companyService from './companyService.js';
import * as jobStateMachine from '../stateMachine/jobStateMachine.js'
import { toDateString } from '../util/date.js'; // Import the new date helper

const logger = log4js.getLogger('jobService');

// TODO: remove this
/**
 * Validates the years of experience format.
 * It must be a single number or a range like '1-3'.
 * @param {string} experience The experience string to validate.
 * @returns {boolean} True if the format is valid, otherwise false.
 */
 const isValidExperience = (experience) => {
    if (typeof experience !== 'string') {
        return false;
    }
    // Regex to check for a single number or a number range (e.g., '1-3')
    return /^\d+$|^\d+-\d+$/.test(experience);
};

/**
 * Creates a new job with a unique job number and slug.
 * @param {object} jobData The job data from the request.
 * @returns {object} The newly created job object.
 */
 export const createJob = (jobData) => {
    // Validate the years of experience.
    if (jobData.yearsOfExperienceNeed && !isValidExperience(jobData.yearsOfExperienceNeed)) {
        throw new Error('Invalid years of experience format. Must be a number or a range (e.g., "1-3").');
    }

    let company;
    if (jobData.companyId) {
        // Find the company by ID if it's provided.
        company = companyService.getCompanyById(jobData.companyId);
    } else if (jobData.companyName) {
        // If no ID, find or create the company by name.
        company = companyService.findOrCreateCompanyByName({ name: jobData.companyName });
    } else {
        throw new Error('Either companyId or companyName is required.');
    }

    // Generate a unique job number with a timestamp
    const jobNumber = `JOB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const slug = slugify(`${jobData.title}-${company.name}-${jobNumber}`, { lower: true, strict: true });
    
    let deadlineTimestamp = jobData.deadline;

    // Convert deadline string to a timestamp if provided.
    if (deadlineTimestamp && typeof deadlineTimestamp === 'string') {
        const date = new Date(deadlineTimestamp);
        // Check if the date is valid. If not, throw an error.
        if (isNaN(date.getTime())) {
            throw new Error('Invalid deadline date format. Please use a valid date string.');
        }
        deadlineTimestamp = date.getTime();
    }

    const newJob = {
        id: uuidv4(),
        jobNumber,
        slug,
        state: jobStateMachine.JOB_STATE.ACTIVE,
        jobStatus: jobStateMachine.JOB_STATUS.CREATED,
        title: jobData.title,
        companyId: company.id,
        location: jobData.location,
        locationType: jobData.locationType,
        dateCreated: Date.now(),
        datePublished: null,
        deadline: deadlineTimestamp,
        jobType: jobData.jobType,
        yearsOfExperienceNeed: jobData.yearsOfExperienceNeed,
        numberOfOpenPosition: jobData.numberOfOpenPosition,
        description: jobData.description 
    };

    logger.info("newJob::", newJob)

    jobRepository.insert(newJob);
    return {
        ...newJob,
        dateCreated: toDateString(newJob.dateCreated),
        datePublished: toDateString(newJob.datePublished),
        deadline: toDateString(newJob.deadline),
        companyName: company.name
    };
};

/**
 * Finds all jobs with a 'published' status.
 * @returns {Array<object>} A list of published jobs.
 */
export const findAllPublishedJobs = () => {
    const jobs = jobRepository.findAllPublished();
    // Map over the jobs to format the date fields.
    return jobs.map(job => ({
        ...job,
        dateCreated: toDateString(job.dateCreated),
        datePublished: toDateString(job.datePublished),
        deadline: toDateString(job.deadline)
    }));
};

/**
 * Finds a single job by its slug.
 * @param {string} slug The job's slug.
 * @returns {object|undefined} The job object if found.
 */
export const findJobBySlug = (slug) => {
    const job = jobRepository.findBySlug(slug);
    if (!job) {
        return null;
    }
    // Format the date fields before returning the job.
    return {
        ...job,
        dateCreated: toDateString(job.dateCreated),
        datePublished: toDateString(job.datePublished),
        deadline: toDateString(job.deadline)
    };
};

export const findJobById = (id) => {
    const job = jobRepository.findById(id);
    if (!job) {
        return null;
    }
    return {
        ...job,
        dateCreated: toDateString(job.dateCreated),
        datePublished: toDateString(job.datePublished),
        deadline: toDateString(job.deadline)
    };
};

/**
 * Updates a job's status based on a specific action.
 * @param {string} jobNumber The unique number of the job.
 * @param {string} action The event to trigger the status change (e.g., 'PUBLISH').
 * @param {object} data The data associated with the action.
 * @returns {object} An object with a success message.
 */
export const updateJobStatus = (jobNumber, action, data) => {
    const job = jobRepository.findByJobNumber(jobNumber);

    if (!job) {
        throw new Error('Job not found.');
    }

    // Call the new changeState method to get the next state.
    const nextState = jobStateMachine.changeState(job.jobStatus, action);

    let datePublished = job.datePublished;

    if (action === 'PUBLISH') {
        datePublished = Date.now();
    }

    jobRepository.updateJobStatus(jobNumber, nextState, datePublished);
    return { message: `Job status updated to ${nextState}.` };
};

/**
 * Finds all jobs, regardless of status.
 * @returns {Array<object>} A list of all jobs.
 */
 export const findAllJobs = () => {
    const jobs = jobRepository.findAll();
    // Map over the jobs to format the date fields.
    return jobs.map(job => ({
        ...job,
        dateCreated: toDateString(job.dateCreated),
        datePublished: toDateString(job.datePublished),
        deadline: toDateString(job.deadline)
    }));
};


/**
 * Checks if an authenticated user has applied for a specific job.
 * Endpoint: GET /job-applications/:jobId/status
 * Access: Authenticated users only.
 */
 export const getApplicationStatus = (req, res) => {
    const { id: userId } = req.user;
    const { jobId } = req.params;
    try {
        const hasApplied = jobApplicationService.checkApplicationStatus(userId, jobId);
        sendResponse(res, 200, 'Application status checked successfully.', { hasApplied });
    } catch (error) {
        logger.error('Failed to check application status:', error);
        sendResponse(res, 400, error.message, null);
    }
};