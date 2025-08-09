
import log4js from 'log4js';
const logger = log4js.getLogger('http'); // Create a logger for HTTP requests

export default (req, res, next) => {
    logger.info(`[${req.method}] ${req.originalUrl}`);
    next();
};
