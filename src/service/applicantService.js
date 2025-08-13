import { v4 as uuidv4 } from 'uuid';
import log4js from 'log4js';
import * as applicantRepository from '../repository/applicantRepository.js';

const logger = log4js.getLogger('applicantService');

/**
 * Creates a new applicant profile.
 * @param {string} userId The ID of the user creating the profile.
 * @param {object} profileData The profile data from the request.
 * @returns {object} The newly created applicant profile.
 */
export const createApplicantProfile = (userId, profileData) => {
    const existingProfile = applicantRepository.findByUserId(userId);
    if (existingProfile) {
        throw new Error('Applicant profile already exists for this user.');
    }

    const { firstName, lastName, email } = profileData;

    if (!firstName || !lastName || !email) {
        throw new Error('First name, last name, and email are required.');
    }

    const newProfile = {
        id: uuidv4(),
        userId,
        firstName,
        lastName,
        address: profileData.address || null,
        phoneNumber: profileData.phoneNumber || null,
        email,
        linkedin: profileData.linkedin || null,
        summary: profileData.summary || null,
        skills: profileData.skills || null
    };

    applicantRepository.insert(newProfile);
    return newProfile;
};

/**
 * Finds an applicant profile by user ID.
 * @param {string} userId The ID of the user.
 * @returns {object|undefined} The applicant profile if found, otherwise undefined.
 */
 export const getApplicantProfileByUserId = (userId) => {
    return applicantRepository.findByUserId(userId);
};


/**
 * Creates a new education entry for an applicant.
 * @param {string} userId The ID of the authenticated user.
 * @param {object} educationData The education data from the request.
 * @returns {object} The newly created education entry.
 */
 export const createEducation = (userId, educationData) => {
    const applicant = applicantRepository.findByUserId(userId);
    if (!applicant) {
        throw new Error('Applicant profile not found.');
    }

    const newEducation = {
        id: uuidv4(),
        applicantId: applicant.id,
        school: educationData.school,
        levelOfEducation: educationData.levelOfEducation,
        fieldOfStudy: educationData.fieldOfStudy || null,
        description: educationData.description || null,
        yearOfGraduation: educationData.yearOfGraduation || null,
    };

    applicantRepository.insertEducation(newEducation);
    return newEducation;
};

/**
 * Gets all education entries for the authenticated user.
 * @param {string} userId The ID of the authenticated user.
 * @returns {Array<object>} A list of education entries.
 */
export const getEducationByUserId = (userId) => {
    const applicant = applicantRepository.findByUserId(userId);
    if (!applicant) {
        return [];
    }
    return applicantRepository.findEducationByApplicantId(applicant.id);
};

/**
 * Creates a new experience entry for an applicant.
 * @param {string} userId The ID of the authenticated user.
 * @param {object} experienceData The experience data from the request.
 * @returns {object} The newly created experience entry.
 */
 export const createExperience = (userId, experienceData) => {
    const applicant = applicantRepository.findByUserId(userId);
    if (!applicant) {
        throw new Error('Applicant profile not found.');
    }

    const newExperience = {
        id: uuidv4(),
        applicantId: applicant.id,
        companyName: experienceData.companyName,
        role: experienceData.role,
        startDate: experienceData.startDate,
        endDate: experienceData.endDate || null,
        description: experienceData.description || null
    };

    applicantRepository.insertExperience(newExperience);
    return newExperience;
};


/**
 * Gets all experience entries for the authenticated user.
 * @param {string} userId The ID of the authenticated user.
 * @returns {Array<object>} A list of experience entries.
 */
 export const getExperienceByUserId = (userId) => {
    const applicant = applicantRepository.findByUserId(userId);
    if (!applicant) {
        return [];
    }
    return applicantRepository.findExperienceByApplicantId(applicant.id);
};