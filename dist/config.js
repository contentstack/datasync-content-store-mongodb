"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    contentStore: {
        collection: {
            asset: 'contents',
            entry: 'contents',
            schema: 'contents',
        },
        dbName: 'contentstack-db',
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
                _checkpoint: true,
                _event_at: true,
                _workflow: true,
                created_by: true,
                publish_details: true,
                _type: true,
                updated_by: true,
            },
            contentType: {
                DEFAULT_ACL: true,
                SYS_ACL: true,
                _workflow: true,
                abilities: true,
                created_by: true,
                last_activity: true,
                updated_by: true,
            },
            entry: {
                _checkpoint: true,
                _event_at: true,
                _workflow: true,
                created_by: true,
                publish_details: true,
                _type: true,
                updated_by: true,
            },
        },
        uri: 'mongodb://localhost:27017',
    },
};
