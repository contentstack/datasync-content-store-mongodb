"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const lodash_1 = require("lodash");
const mongodb_1 = require("mongodb");
const logger_1 = require("./util/logger");
const validations_1 = require("./util/validations");
const debug = debug_1.default('connection');
let indexes = {
    _content_type_uid: 1,
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
            const mongoConfig = config.contentStore;
            validations_1.validateMongodbConfig(mongoConfig);
            const connectionUri = mongoConfig.url || mongoConfig.uri;
            const dbName = mongoConfig.dbName;
            const options = mongoConfig.options;
            debug('connection url', connectionUri);
            debug('db name', dbName);
            debug('collection names', mongoConfig.collection);
            debug('db options', JSON.stringify(options));
            if (mongoConfig.indexes && lodash_1.isPlainObject(mongoConfig.indexes) && !(lodash_1.isEmpty(mongoConfig.indexes))) {
                indexes = lodash_1.merge(indexes, mongoConfig.indexes);
            }
            const client = new mongodb_1.MongoClient(connectionUri, options);
            return client.connect().then(() => {
                instance.db = client.db(dbName);
                instance.client = client;
                logger_1.logger.info(`Mongodb connection to ${connectionUri} established successfully!`);
                resolve(instance);
                const bucket = [];
                for (let key in mongoConfig.collection) {
                    for (let index in indexes) {
                        if (indexes[index] === 1 || indexes[index] === -1) {
                            bucket.push(createIndexes(mongoConfig.collection[key], index, indexes[index]));
                        }
                    }
                }
                Promise.all(bucket)
                    .then(() => {
                    logger_1.logger.info(`Indexes created successfully`);
                });
            }).catch(reject);
        }
        catch (error) {
            return reject(error);
        }
    });
};
const createIndexes = (collectionId, index, type) => {
    return instance.db.collection(collectionId)
        .createIndex({
        [index]: type
    })
        .then((result) => {
        debug(`Indexes result for ${index}: ${JSON.stringify(result)}`);
        return;
    });
};
