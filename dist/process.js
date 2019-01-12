"use strict";
/*!
* Contentstack Mongodb Content Store
* Copyright © 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const logger_1 = require("./util/logger");
const handleExit = (signal) => {
    const killDuration = (process.env.KILLDURATION) ? calculateKillDuration() : 15000;
    logger_1.logger.info(`Received ${signal}. This will shut down the process in ${killDuration}ms..`);
    setInterval(abort, killDuration);
};
const unhandledErrors = (error) => {
    logger_1.logger.error('Unhandled exception caught. Locking down process for 10s to recover..');
    logger_1.logger.error(error);
};
const calculateKillDuration = () => {
    const killDuration = parseInt(process.env.KILLDURATION, 10);
    if (isNaN(killDuration)) {
        return 15000;
    }
    return killDuration;
};
const abort = () => {
    _1.mongoClient.close();
    process.abort();
};
process.on('SIGTERM', handleExit);
process.on('SIGINT', handleExit);
process.on('uncaughtException', unhandledErrors);
//# sourceMappingURL=process.js.map