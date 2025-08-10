import express from 'express';
import path from 'path';
import errorHandler from './src/middleware/error.js';
import mainRouter from './src/route/index.js';
import db, { initializeDb } from './src/repository/db.js';
import { initSeedData } from './src/repository/dbSeeder.js';
import notFoundHandler from './src/middleware/notFoundHandler.js';
import logger from './src/middleware/logger.js';
import appLogger from './src/config/log4js.js';

const port = process.env.PORT || 8000;

const app = express();

app.use(express.json());

// Use the logger middleware at the beginning to log every request.
app.use(logger);

// Routes
app.use(mainRouter);

// Error handler
app.use(errorHandler);

// Not found handler
app.use(notFoundHandler);

// Start the server and log the port it's running on.
app.listen(port, () => {
    // Run the database initializer and seeder on startup.
    initializeDb();
    initSeedData();
    appLogger.info(`Server is running on port ${port}`);
});