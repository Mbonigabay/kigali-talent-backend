import Database from 'better-sqlite3';
import appLogger from '../config/log4js.js';

// Create a single, shared database instance.
const db = new Database('./database.sqlite');
appLogger.info('Database connected successfully.');

// A method to create the 'users' table.
const createUsersTable = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `);
    appLogger.info("'users' table created or already exists.");
};

// A method to create the 'products' table.
const createProductsTable = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL
        )
    `);
    appLogger.info("'products' table created or already exists.");
};

// A dedicated function to initialize all necessary tables.
const initializeDb = () => {
    try {
        createUsersTable();
        createProductsTable();
        appLogger.info('All database tables created or already exist.');
    } catch (error) {
        appLogger.error('Failed to initialize database tables:', error);
        throw error;
    }
};

// Immediately initialize the database when this module is loaded.
initializeDb();

// Export the single database instance for use by other modules.
export default db;
