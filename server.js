import express from 'express';
import path from 'path';
import errorHandler from './middleware/error.js';
import mainRouter from './route/index.js';
import './repository/db.js'
import notFoundHandler from './middleware/notFoundHandler.js';
import logger from './middleware/logger.js';
import appLogger from './config/log4js.js';

const port = process.env.PORT;

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

app.listen(port, () => appLogger.info(`Server is running on port ${port}`));