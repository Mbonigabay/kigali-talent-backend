import * as jobService from '../service/jobService.js';
import { sendResponse } from '../util/response.js';
import log4js from 'log4js';
const logger = log4js.getLogger('jobController');

/**
 * Handles the creation of a new job.
 * Endpoint: POST /jobs
 * Access: Admin only
 */
export const createJob = (req, res) => {
    try {
        const newJob = jobService.createJob(req.body);
        sendResponse(res, 201, 'Job created successfully.', newJob);
    } catch (error) {
        logger.error('Failed to create job:', error);
        sendResponse(res, 400, error.message, null);
    }
};

/**
 * Handles the request to view all published jobs.
 * Endpoint: GET /jobs
 * Access: Public
 */
export const getPublishedJobs = (req, res) => {
    try {
        const jobs = jobService.findAllPublishedJobs();
        sendResponse(res, 200, 'Published jobs retrieved successfully.', jobs);
    } catch (error) {
        logger.error('Failed to retrieve published jobs:', error);
        sendResponse(res, 500, 'Server Error', null);
    }
};

/**
 * Handles the request to view all jobs (for admins).
 * Endpoint: GET /jobs/all
 * Access: Admin only
 */
 export const getAllJobs = (req, res) => {
    try {
        const jobs = jobService.findAllJobs();
        sendResponse(res, 200, 'All jobs retrieved successfully.', jobs);
    } catch (error) {
        logger.error('Failed to retrieve all jobs:', error);
        sendResponse(res, 500, 'Server Error', null);
    }
};

/**
 * Handles the request to view a job by its slug.
 * Endpoint: GET /jobs/:slug
 * Access: Public
 */
export const getJobBySlug = (req, res) => {
    try {
        const { slug } = req.params;
        const job = jobService.findJobBySlug(slug);
        if (!job) {
            return sendResponse(res, 404, 'Job not found.', null);
        }
        sendResponse(res, 200, 'Job retrieved successfully.', job);
    } catch (error) {
        logger.error('Failed to retrieve job by slug:', error);
        sendResponse(res, 500, 'Server Error', null);
    }
};

/**
 * Handles the update of a job's status.
 * Endpoint: PUT /jobs/update-job/status
 * Access: Admin only
 */
 export const updateJobStatus = (req, res) => {
    const { jobNumber, action, data } = req.body;

    if (!jobNumber || !action) {
        return sendResponse(res, 400, 'Job number and action are required.', null);
    }

    try {
        const result = jobService.updateJobStatus(jobNumber, action, data);
        sendResponse(res, 200, result.message, null);
    } catch (error) {
        logger.error('Failed to update job status:', error);
        sendResponse(res, 400, error.message, null);
    }
};