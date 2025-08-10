import * as applicantService from '../service/applicantService.js';
import { sendResponse } from '../util/response.js';
import log4js from 'log4js';
const logger = log4js.getLogger('applicantController');

/**
 * Handles the creation of a new applicant profile.
 * Endpoint: POST /applicants/profile
 * Access: Authenticated applicants only.
 */
export const createApplicantProfile = (req, res) => {
    const { id } = req.user; // Get the user ID from the JWT payload
    try {
        const newProfile = applicantService.createApplicantProfile(id, req.body);
        sendResponse(res, 201, 'Applicant profile created successfully.', newProfile);
    } catch (error) {
        logger.error('Failed to create applicant profile:', error);
        sendResponse(res, 400, error.message, null);
    }
};
