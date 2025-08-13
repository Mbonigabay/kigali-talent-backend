import { getAllUsers } from '../service/userService.js';
import { sendResponse } from '../util/response.js';

/**
 * Handles the update of a job's status.
 * Endpoint: PUT /jobs/update-job/status
 * Access: Admin only
 */
export const getUsers = (req, res) => {
    try {
        const users = getAllUsers();
        sendResponse(res, 200, 'Users fetched successfully', users);
    } catch (error) {
        console.error('Error fetching users:', error);
        sendResponse(res, 500, 'Server Error', null);
    }
};
