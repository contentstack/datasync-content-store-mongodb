"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    'content-connector': {
        dbName: 'contentstack-persistent-db',
        options: {
            autoReconnect: true,
            connectTimeoutMS: 15000,
            keepAlive: true,
            noDelay: true,
            reconnectInterval: 1000,
            reconnectTries: 20,
            userNewUrlParser: true,
        },
        uri: 'mongodb://localhost:27017',
    },
};
//# sourceMappingURL=defaults.js.map