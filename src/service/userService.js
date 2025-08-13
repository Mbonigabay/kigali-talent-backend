import * as userRepository from '../repository/userRepository.js';
import * as emailService from './emailService.js';

export const getAllUsers = () => {
    return userRepository.findAll();
};

export const createUser = (name) => {
    const newUserId = userRepository.insert(name);
    return { id: newUserId, name };
};