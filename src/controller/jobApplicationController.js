import * as jobApplicationService from '../service/jobApplicationService.js';
import { sendResponse } from '../util/response.js';
import log4js from 'log4js';
const logger = log4js.getLogger('jobApplicationController');

/**
 * Handles the submission of a new job application.
 * Endpoint: POST /job-applications/:jobNumber/apply
 * Access: Authenticated applicants only.
 */
export const applyForJob = (req, res) => {
    const { id } = req.user; // Get the user ID from the JWT payload
    const { jobNumber } = req.params;
    try {
        const newApplication = jobApplicationService.applyForJob(id, jobNumber);
        sendResponse(res, 201, 'Application submitted successfully.', newApplication);
    } catch (error) {
        logger.error('Failed to submit job application:', error);
        sendResponse(res, 400, error.message, null);
    }
};


/**
 * Retrieves all job applications for a specific job.
 * Endpoint: GET /job-applications/jobs/:jobId
 * Access: Admin only.
 */
 export const getApplicationsByJobId = (req, res) => {
    const { jobId } = req.params;
    try {
        const applications = jobApplicationService.getApplicationsForJob(jobId);
        sendResponse(res, 200, 'Job applications retrieved successfully.', applications);
    } catch (error) {
        logger.error('Failed to retrieve job applications:', error);
        sendResponse(res, 400, error.message, null);
    }
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


/**
 * Handles the update of a job application's status.
 * Endpoint: PUT /update-job-application/status
 * Access: Admin only.
 */
 export const updateJobApplicationStatus = (req, res) => {
    const { jobApplicationId, action } = req.body;

    logger.info("jobApplicationId::", jobApplicationId);

    if (!jobApplicationId || !action) {
        return sendResponse(res, 400, 'Job Application ID and action are required.', null);
    }

    try {
        const result = jobApplicationService.updateJobApplicationStatus(jobApplicationId, action);
        sendResponse(res, 200, result.message, { newStatus: result.newStatus });
    } catch (error) {
        logger.error('Failed to update job application status:', error);
        sendResponse(res, 400, error.message, null);
    }
};

/**
 * Retrieves all applications for the authenticated user.
 * Endpoint: GET /job-applications/my-applications
 * Access: Authenticated applicants only.
 */
 export const getMyApplications = (req, res) => {
    const { id: userId } = req.user;
    try {
        const applications = jobApplicationService.getApplicationsForApplicant(userId);
        sendResponse(res, 200, 'My applications retrieved successfully.', applications);
    } catch (error) {
        logger.error('Failed to retrieve my applications:', error);
        sendResponse(res, 500, error.message, null);
    }
};