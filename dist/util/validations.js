"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringify_1 = require("./stringify");
const mandatoryACMethods = ['download', 'delete', 'unpublish'];
const mandatoryUpsertKeys = ['content_type_uid', 'locale', 'data', 'uid'];
const mandatoryRemoveKeys = ['content_type_uid', 'locale', 'uid'];
exports.validateConfig = (config) => {
    if (typeof config['content-connector'].options !== 'object' || Object.keys(config['content-connector'].options).length
        === 0) {
        throw new Error('Content connector options cannot be empty!');
    }
    else if (typeof config['content-connector'].uri !== 'string' || config['content-connector'].uri.length === 0) {
        throw new Error('Content connector uri should be of type string and not empty!');
    }
};
exports.validateAssetConnectorInstance = (instance) => {
    mandatoryACMethods.forEach((methodName) => {
        if (!(methodName in instance)) {
            throw new Error(`${stringify_1.stringify(instance)} connector does not have ${methodName}`);
        }
    });
};
exports.validateMongodbConfig = (config = {}) => {
    if (typeof config.uri !== 'string' || config.uri.length === 0) {
        throw new Error("Mongodb config 'uri' should be of type string and not empty!");
    }
    else if (typeof config.dbName !== 'string' || (config.dbName.length === 0 || config.dbName.length > 64)) {
        throw new Error("Mongodb config 'dbName' should be of type string and have length between '1-64'");
    }
    else if (typeof config.options !== 'object' || (Object.keys(config.options).length === 0)) {
        throw new Error("Mongodb config 'option' should be of type object and not empty!");
    }
};
exports.validateAssetPublish = (asset) => {
    mandatoryUpsertKeys.forEach((key) => {
        if (!(key in asset)) {
            throw new Error(`${key} is missing in asset publish!`);
        }
    });
};
exports.validateEntryPublish = (entry) => {
    mandatoryUpsertKeys.forEach((key) => {
        if (!(key in entry)) {
            throw new Error(`${key} is missing in entry publish!`);
        }
    });
};
exports.validateEntryRemove = (entry) => {
    mandatoryRemoveKeys.forEach((key) => {
        if (!(key in entry)) {
            throw new Error(`${key} is missing in entry unpublish/delete!`);
        }
    });
};
exports.validateAssetUnpublish = (asset) => {
    mandatoryRemoveKeys.forEach((key) => {
        if (!(key in asset)) {
            throw new Error(`${key} is missing in asset unpublish!`);
        }
    });
};
exports.validateAssetDelete = (asset) => {
    mandatoryRemoveKeys.forEach((key) => {
        if (!(key in asset)) {
            throw new Error(`${key} is missing in asset delete!`);
        }
    });
};
exports.validateContentTypeDelete = (contentType) => {
    mandatoryRemoveKeys.forEach((key) => {
        if (!(key in contentType)) {
            throw new Error(`${key} is missing in content type delete!`);
        }
    });
};
exports.validateLogger = (instance) => {
    let flag = false;
    if (!instance) {
        return flag;
    }
    const requiredFn = ['info', 'warn', 'log', 'error', 'debug'];
    requiredFn.forEach((name) => {
        if (typeof instance[name] !== 'function') {
            console.warn(`Unable to register custom logger since '${name}()' does not exist on ${instance}!`);
            flag = true;
        }
    });
    return !flag;
};
//# sourceMappingURL=validations.js.map