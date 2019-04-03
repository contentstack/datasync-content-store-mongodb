"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    contentStore: {
        dbName: 'contentstack-persistent-db',
        collectionName: 'contents',
        indexes: {
            published_at: -1,
            content_type_uid: 1,
            locale: 1,
            uid: 1
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
        indexedKeys: {
            content_type_uid: true,
            locale: true,
            uid: true,
            published_at: true
        },
        unwantedKeys: {
            asset: {
                action: true,
                checkpoint: true,
                'data.created_by': true,
                event_at: true,
                type: true,
                'data.updated_by': true
            },
            contentType: {
                'data.created_by': true,
                'data.updated_by': true,
                'data.DEFAULT_ACL': true,
                'data.SYS_ACL': true,
                'data.abilities': true,
                'data.last_activity': true
            },
            entry: {
                action: true,
                checkpoint: true,
                'data.created_by': true,
                event_at: true,
                type: true,
                'data.updated_by': true
            },
        },
        uri: 'mongodb://localhost:27017',
    },
};
