import db from './db.js';

// Finds all users in the database.
export const findAll = () => {
    return db.prepare('SELECT * FROM users').all();
};

// Inserts a new user into the database.
export const insert = (name) => {
    const stmt = db.prepare('INSERT INTO users (name) VALUES (?)');
    const info = stmt.run(name);
    return info.lastInsertRowid;
};
