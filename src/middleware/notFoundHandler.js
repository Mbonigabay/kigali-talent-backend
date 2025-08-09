import { sendResponse } from '../util/response.js';

/**
 * Express middleware to handle 404 Not Found errors.
 * It sends a standardized JSON response for any unhandled routes.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 */
const notFoundHandler = (req, res) => {
    sendResponse(res, 404, 'The requested resource was not found.', null);
};

export default notFoundHandler;
