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
const validations_1 = require("./util/validations");
const debug = debug_1.default('connection');
let indexes = {
    _content_type_uid: 1,
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
                console.info(`Mongodb connection to ${connectionUri} established successfully!`);
                return resolve(instance);
            })
                .catch(reject);
        }
        catch (error) {
            return reject(error);
        }
    });
};
