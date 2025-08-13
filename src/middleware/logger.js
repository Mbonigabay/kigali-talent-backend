
import log4js from 'log4js';
const logger = log4js.getLogger('http');

export default (req, res, next) => {
    logger.info(`[${req.method}] ${req.originalUrl}`);
    next();
};
