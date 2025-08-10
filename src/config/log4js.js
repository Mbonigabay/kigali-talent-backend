// This file configures the log4js library.

import log4js from 'log4js';

log4js.configure({
    // Define different appenders (where logs are written).
    appenders: {
        // Console appender for development.
        console: { type: 'console' },
        // File appender for production.
        file: { type: 'file', filename: 'app.log' }
    },
    // Define different logging categories and their appenders/levels.
    categories: {
        // Default category for general logs, using the console appender.
        default: { appenders: ['console'], level: 'debug' },
        // A category specifically for the application, also to the console.
        app: { appenders: ['console'], level: 'info' },
        // Add a new category for the database seeder
        dbSeeder: { appenders: ['console'], level: 'info' },
        // Add a new category for the database module
        db: { appenders: ['console'], level: 'info' }
        // For production, you might configure the file appender here:
        // app: { appenders: ['file'], level: 'info' }
    }
});

// Export the logger instance for use throughout the application.
export default log4js.getLogger('app');
