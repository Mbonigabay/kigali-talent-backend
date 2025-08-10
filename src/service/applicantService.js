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
