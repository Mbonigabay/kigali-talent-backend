/**
 * Sends a standardized JSON response.
 * @param {object} res The Express response object.
 * @param {number} code The HTTP status code (e.g., 200, 201, 400, 500).
 * @param {string} message A descriptive message for the response.
 * @param {any} payload The data to be sent in the response.
 */
 export const sendResponse = (res, code, message, payload) => {
    // Return a JSON object with the requested format
    return res.status(code).json({
        code,
        message,
        payload
    });
};
