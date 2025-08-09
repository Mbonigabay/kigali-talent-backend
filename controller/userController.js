import { getAllUsers } from '../service/userService.js';
import { sendResponse } from '../util/response.js';

export const getUsers = (req, res) => {
    try {
        const users = getAllUsers();
        sendResponse(res, 200, 'Users fetched successfully', users);
    } catch (error) {
        console.error('Error fetching users:', error);
        sendResponse(res, 500, 'Server Error', null);
    }
};
