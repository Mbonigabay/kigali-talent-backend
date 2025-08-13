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
    const { id } = req.user;
    try {
        const newProfile = applicantService.createApplicantProfile(id, req.body);
        sendResponse(res, 201, 'Applicant profile created successfully.', newProfile);
    } catch (error) {
        logger.error('Failed to create applicant profile:', error);
        sendResponse(res, 400, error.message, null);
    }
};


/**
 * Handles the request to get the authenticated user's profile.
 * Endpoint: GET /applicants/profile
 * Access: Authenticated applicants only.
 */
 export const getApplicantProfile = (req, res) => {
    const { id: userId } = req.user;
    try {
        const profile = applicantService.getApplicantProfileByUserId(userId);
        if (!profile) {
            return sendResponse(res, 404, 'Applicant profile not found.', null);
        }
        sendResponse(res, 200, 'Applicant profile retrieved successfully.', profile);
    } catch (error) {
        logger.error('Failed to get applicant profile:', error);
        sendResponse(res, 500, error.message, null);
    }
};


/**
 * Handles the creation of a new education entry for the applicant.
 * Endpoint: POST /applicants/education
 * Access: Authenticated applicants only.
 */
 export const createEducation = (req, res) => {
    const { id: userId } = req.user;
    try {
        const newEducation = applicantService.createEducation(userId, req.body);
        sendResponse(res, 201, 'Education entry created successfully.', newEducation);
    } catch (error) {
        logger.error('Failed to create education entry:', error);
        sendResponse(res, 400, error.message, null);
    }
};

/**
 * Handles the request to get all education entries for the authenticated user.
 * Endpoint: GET /applicants/education
 * Access: Authenticated applicants only.
 */
export const getEducation = (req, res) => {
    const { id: userId } = req.user;
    try {
        const education = applicantService.getEducationByUserId(userId);
        sendResponse(res, 200, 'Education entries retrieved successfully.', education);
    } catch (error) {
        logger.error('Failed to get education entries:', error);
        sendResponse(res, 500, error.message, null);
    }
};


/**
 * Handles the creation of a new experience entry for the applicant.
 * Endpoint: POST /applicants/experience
 * Access: Authenticated applicants only.
 */
 export const createExperience = (req, res) => {
    const { id: userId } = req.user;
    try {
        const newExperience = applicantService.createExperience(userId, req.body);
        sendResponse(res, 201, 'Experience entry created successfully.', newExperience);
    } catch (error) {
        logger.error('Failed to create experience entry:', error);
        sendResponse(res, 400, error.message, null);
    }
};


/**
 * Handles the request to get all experience entries for the authenticated user.
 * Endpoint: GET /applicants/experience
 * Access: Authenticated applicants only.
 */
 export const getExperience = (req, res) => {
    const { id: userId } = req.user;
    try {
        const experience = applicantService.getExperienceByUserId(userId);
        sendResponse(res, 200, 'Experience entries retrieved successfully.', experience);
    } catch (error) {
        logger.error('Failed to get experience entries:', error);
        sendResponse(res, 500, error.message, null);
    }
};