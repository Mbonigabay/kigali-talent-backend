import { v4 as uuidv4 } from 'uuid';
import log4js from 'log4js';
import * as companyRepository from '../repository/companyRepository.js';

const logger = log4js.getLogger('companyService');

/**
 * Creates a new company.
 * @param {object} companyData The data for the new company.
 * @returns {object} The newly created company object.
 */
export const createCompany = (companyData) => {
    const existingCompany = companyRepository.findByName(companyData.name);
    if (existingCompany) {
        throw new Error('Company with this name already exists.');
    }

    const newCompany = {
        id: uuidv4(),
        name: companyData.name,
        description: companyData.description || null,
        sector: companyData.sector || null,
        location: companyData.location || null,
        website: companyData.website || null
    };

    companyRepository.insert(newCompany);
    return newCompany;
};

/**
 * Finds a company by name or creates it if it doesn't exist.
 * This is useful for the job creation process.
 * @param {object} companyData The company data.
 * @returns {object} The found or newly created company.
 */
export const findOrCreateCompanyByName = (companyData) => {
    let company = companyRepository.findByName(companyData.name);
    if (!company) {
        company = createCompany(companyData);
    }
    return company;
};

/**
 * Retrieves all companies.
 * @returns {Array<object>} A list of all companies.
 */
export const getCompanies = () => {
    return companyRepository.findAll();
};

/**
 * Retrieves a single company by its ID.
 * @param {string} id The company's ID.
 * @returns {object|undefined} The company object or undefined.
 */
export const getCompanyById = (id) => {
    const company = companyRepository.findById(id);
    if (!company) {
        throw new Error('Company not found.');
    }
    return company;
};

/**
 * Updates an existing company's information.
 * @param {string} id The company's ID.
 * @param {object} companyData The updated company data.
 */
export const updateCompany = (id, companyData) => {
    const company = companyRepository.findById(id);
    if (!company) {
        throw new Error('Company not found.');
    }
    companyRepository.update(id, companyData);
    return { message: 'Company updated successfully.' };
};

/**
 * Deletes a company by its ID.
 * @param {string} id The company's ID.
 */
export const deleteCompany = (id) => {
    const company = companyRepository.findById(id);
    if (!company) {
        throw new Error('Company not found.');
    }
    companyRepository.remove(id);
    return { message: 'Company deleted successfully.' };
};
