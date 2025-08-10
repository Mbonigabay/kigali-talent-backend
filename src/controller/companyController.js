// This controller handles incoming requests for company management.

import * as companyService from '../service/companyService.js';
import { sendResponse } from '../util/response.js';
import log4js from 'log4js';
const logger = log4js.getLogger('companyController');

/**
 * Handles the creation of a new company.
 * Endpoint: POST /companies
 */
export const createCompany = (req, res) => {
    try {
        const newCompany = companyService.createCompany(req.body);
        sendResponse(res, 201, 'Company created successfully.', newCompany);
    } catch (error) {
        logger.error('Failed to create company:', error);
        sendResponse(res, 400, error.message, null);
    }
};

/**
 * Handles retrieving all companies.
 * Endpoint: GET /companies
 */
export const getCompanies = (req, res) => {
    try {
        const companies = companyService.getCompanies();
        sendResponse(res, 200, 'Companies retrieved successfully.', companies);
    } catch (error) {
        logger.error('Failed to retrieve companies:', error);
        sendResponse(res, 500, 'Server Error', null);
    }
};

/**
 * Handles retrieving a single company by ID.
 * Endpoint: GET /companies/:id
 */
export const getCompanyById = (req, res) => {
    try {
        const { id } = req.params;
        const company = companyService.getCompanyById(id);
        sendResponse(res, 200, 'Company retrieved successfully.', company);
    } catch (error) {
        logger.error(`Failed to retrieve company with ID ${req.params.id}:`, error);
        sendResponse(res, 404, error.message, null);
    }
};

/**
 * Handles updating a company's information.
 * Endpoint: PUT /companies/:id
 */
export const updateCompany = (req, res) => {
    try {
        const { id } = req.params;
        const result = companyService.updateCompany(id, req.body);
        sendResponse(res, 200, result.message, null);
    } catch (error) {
        logger.error(`Failed to update company with ID ${req.params.id}:`, error);
        sendResponse(res, 404, error.message, null);
    }
};

/**
 * Handles deleting a company.
 * Endpoint: DELETE /companies/:id
 */
export const deleteCompany = (req, res) => {
    try {
        const { id } = req.params;
        const result = companyService.deleteCompany(id);
        sendResponse(res, 200, result.message, null);
    } catch (error) {
        logger.error(`Failed to delete company with ID ${req.params.id}:`, error);
        sendResponse(res, 404, error.message, null);
    }
};
