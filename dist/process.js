"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const handleExit = (signal) => {
    const killDuration = (process.env.KILLDURATION) ? calculateKillDuration() : 15000;
    console.info(`Received ${signal}. This will shut down the process in ${killDuration}ms..`);
    setInterval(abort, killDuration);
};
const unhandledErrors = (error) => {
    console.error('Unhandled exception caught. Locking down process for 10s to recover..');
    console.error(error);
};
const calculateKillDuration = () => {
    const killDuration = parseInt(process.env.KILLDURATION, 10);
    if (isNaN(killDuration)) {
        return 15000;
    }
    return killDuration;
};
const abort = () => {
    const mongoClient = (0, _1.getMongoClient)();
    mongoClient.client.close();
    process.abort();
};
process.on('SIGTERM', handleExit);
process.on('SIGINT', handleExit);
process.on('uncaughtException', unhandledErrors);
