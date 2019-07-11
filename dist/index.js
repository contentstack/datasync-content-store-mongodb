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
const config_1 = require("./config");
const connection_1 = require("./connection");
const mongodb_1 = require("./mongodb");
const index_1 = require("./util/index");
const validations_1 = require("./util/validations");
const debug = debug_1.default('registration');
let appConfig = {};
let assetConnectorInstance;
let mongoClient;
exports.setAssetConnector = (instance) => {
    assetConnectorInstance = instance;
};
exports.setConfig = (config) => {
    appConfig = config;
};
exports.getConfig = () => {
    return appConfig;
};
exports.getMongoClient = () => {
    return mongoClient;
};
exports.start = (connector, config) => {
    return new Promise((resolve, reject) => {
        try {
            appConfig = lodash_1.merge(config_1.config, appConfig, config);
            validations_1.validateConfig(appConfig);
            appConfig = index_1.sanitizeConfig(appConfig);
            assetConnectorInstance = connector || assetConnectorInstance;
            validations_1.validateAssetConnectorInstance(assetConnectorInstance);
            return connection_1.connect(appConfig)
                .then((mongo) => {
                mongoClient = new mongodb_1.Mongodb(mongo, assetConnectorInstance, appConfig.contentStore);
                debug('Mongo connector instance created successfully!');
                return resolve(mongoClient);
            })
                .catch(reject);
        }
        catch (error) {
            return reject(error);
        }
    });
};
