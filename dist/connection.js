"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const mongodb_1 = require("mongodb");
const logger_1 = require("./util/logger");
const validations_1 = require("./util/validations");
let indexes = {
    content_type_uid: 1,
    locales: 1,
    uid: 1,
};
const instance = {};
exports.connect = (config) => {
    return new Promise((resolve, reject) => {
        try {
            if (Object.keys(instance).length !== 0) {
                return resolve(instance);
            }
            const mongoConfig = config['content-connector'];
            validations_1.validateMongodbConfig(mongoConfig);
            const connectionUri = mongoConfig.uri;
            const dbName = mongoConfig.dbName;
            const options = mongoConfig.options;
            if (mongoConfig.indexes && lodash_1.isPlainObject(mongoConfig.indexes) && !(lodash_1.isEmpty(mongoConfig.indexes))) {
                indexes = lodash_1.merge(mongoConfig.indexes);
            }
            const client = new mongodb_1.MongoClient(connectionUri, options);
            return client.connect().then(() => {
                instance.db = client.db(dbName);
                instance.db.collection('contents').createIndex(indexes).then(() => {
                    logger_1.logger.info(`Mongodb connection to ${connectionUri} established successfully!`);
                    instance.client = client;
                    return resolve(instance);
                }).catch(reject);
            }).catch(reject);
        }
        catch (error) {
            return reject(error);
        }
    });
};
