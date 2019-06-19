"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    contentStore: {
        dbName: 'contentstack-db',
        collection: {
            entry: 'contents',
            asset: 'contents',
            schema: 'contents'
        },
        options: {
            autoReconnect: true,
            connectTimeoutMS: 15000,
            keepAlive: true,
            noDelay: true,
            reconnectInterval: 1000,
            reconnectTries: 20,
            useNewUrlParser: true,
        },
        unwantedKeys: {
            asset: {
                type: true,
                _checkpoint: true,
                _workflow: true,
                created_by: true,
                _event_at: true,
                updated_by: true,
                publish_details: true,
            },
            contentType: {
                created_by: true,
                updated_by: true,
                DEFAULT_ACL: true,
                SYS_ACL: true,
                abilities: true,
                last_activity: true,
                _workflow: true,
            },
            entry: {
                type: true,
                _checkpoint: true,
                _workflow: true,
                created_by: true,
                _event_at: true,
                updated_by: true,
                publish_details: true,
            },
        },
        uri: 'mongodb://localhost:27017',
    },
};
