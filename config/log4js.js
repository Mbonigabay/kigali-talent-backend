import log4js from 'log4js';

log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: { type: 'file', filename: 'app.log' }
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' },
        app: { appenders: ['console'], level: 'info' }
    }
});

export default log4js.getLogger('app');