"use strict";
/*!
<<<<<<< HEAD
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
=======
<<<<<<< HEAD
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
=======
* Contentstack Mongodb Content Store
* Copyright © 2019 Contentstack LLC
>>>>>>> ee31b51fa72be4b95d012630091a2b7b449001e0
>>>>>>> develop
* MIT Licensed
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const lodash_1 = require("lodash");
const connection_1 = require("./connection");
const defaults_1 = require("./defaults");
const mongodb_1 = require("./mongodb");
const logger_1 = require("./util/logger");
const validations_1 = require("./util/validations");
const debug = debug_1.default('registration');
let appConfig = {};
let assetConnectorInstance;
exports.setAssetConnector = (instance) => {
    debug('Asset connector instance registered successfully');
    assetConnectorInstance = instance;
};
exports.setConfig = (config) => {
    appConfig = config;
};
var logger_2 = require("./util/logger");
exports.setLogger = logger_2.setLogger;
exports.getConfig = () => {
    return appConfig;
};
exports.start = (connector, config, logger) => {
    return new Promise((resolve, reject) => {
        try {
            appConfig = lodash_1.merge(defaults_1.config, appConfig, config);
            validations_1.validateConfig(appConfig);
            assetConnectorInstance = connector || assetConnectorInstance;
            validations_1.validateAssetConnectorInstance(assetConnectorInstance);
            logger_1.setLogger(logger);
            return connection_1.connect(appConfig).then((mongo) => {
                exports.mongoClient = new mongodb_1.Mongodb(mongo, assetConnectorInstance);
                return resolve(exports.mongoClient);
            }).catch(reject);
        }
        catch (error) {
            return reject(error);
        }
    });
};
//# sourceMappingURL=index.js.map