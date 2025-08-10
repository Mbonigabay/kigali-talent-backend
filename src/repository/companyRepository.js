import db from './db.js';

/**
 * Inserts a new company into the database.
 * @param {object} companyData The company data.
 * @returns {object} The company object with its ID.
 */
export const insert = (companyData) => {
    const stmt = db.prepare('INSERT INTO companies (id, name, description, sector, location, website) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(
        companyData.id,
        companyData.name,
        companyData.description,
        companyData.sector,
        companyData.location,
        companyData.website
    );
    return companyData;
};

/**
 * Finds all companies in the database.
 * @returns {Array<object>} A list of all companies.
 */
export const findAll = () => {
    return db.prepare('SELECT * FROM companies').all();
};

/**
 * Finds a company by its ID.
 * @param {string} id The company's ID.
 * @returns {object|undefined} The company object if found, otherwise undefined.
 */
export const findById = (id) => {
    return db.prepare('SELECT * FROM companies WHERE id = ?').get(id);
};

/**
 * Finds a company by its name.
 * @param {string} name The company's name.
 * @returns {object|undefined} The company object if found, otherwise undefined.
 */
export const findByName = (name) => {
    return db.prepare('SELECT * FROM companies WHERE name = ?').get(name);
};

/**
 * Updates an existing company's information.
 * @param {string} id The company's ID.
 * @param {object} companyData The company data to update.
 */
export const update = (id, companyData) => {
    const stmt = db.prepare(`
        UPDATE companies SET name = ?, description = ?, sector = ?, location = ?, website = ?
        WHERE id = ?
    `);
    stmt.run(
        companyData.name,
        companyData.description,
        companyData.sector,
        companyData.location,
        companyData.website,
        id
    );
};

/**
 * Deletes a company by its ID.
 * @param {string} id The company's ID.
 */
export const remove = (id) => {
    db.prepare('DELETE FROM companies WHERE id = ?').run(id);
};
