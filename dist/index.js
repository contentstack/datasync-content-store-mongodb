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
exports.start = exports.getMongoClient = exports.getConfig = exports.setConfig = exports.setAssetConnector = void 0;
const debug_1 = __importDefault(require("debug"));
const lodash_1 = require("lodash");
const config_1 = require("./config");
const connection_1 = require("./connection");
const mongodb_1 = require("./mongodb");
const index_1 = require("./util/index");
const validations_1 = require("./util/validations");
const debug = (0, debug_1.default)('registration');
let appConfig = {};
let assetConnectorInstance;
let mongoClient;
const setAssetConnector = (instance) => {
    assetConnectorInstance = instance;
};
exports.setAssetConnector = setAssetConnector;
const setConfig = (config) => {
    appConfig = config;
};
exports.setConfig = setConfig;
const getConfig = () => {
    return appConfig;
};
exports.getConfig = getConfig;
const getMongoClient = () => {
    return mongoClient;
};
exports.getMongoClient = getMongoClient;
const start = (connector, config) => {
    return new Promise((resolve, reject) => {
        try {
            appConfig = (0, lodash_1.merge)(config_1.config, appConfig, config);
            (0, validations_1.validateConfig)(appConfig);
            appConfig = (0, index_1.sanitizeConfig)(appConfig);
            assetConnectorInstance = connector || assetConnectorInstance;
            (0, validations_1.validateAssetConnectorInstance)(assetConnectorInstance);
            return (0, connection_1.connect)(appConfig)
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
exports.start = start;
