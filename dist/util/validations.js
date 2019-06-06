"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
const requiredUpsertKeys = ['_content_type_uid', 'locale', 'uid'];
const requiredRemoveKeys = ['_content_type_uid', 'locale', 'uid'];
exports.validateConfig = (config) => {
    if (typeof config.contentStore.options !== 'object' || Object.keys(config.contentStore.options).length
        === 0) {
        throw new Error('Content connector options cannot be empty!');
    }
    else if (typeof config.contentStore.uri !== 'string' || config.contentStore.uri.length === 0) {
        throw new Error('Content connector uri should be of type string and not empty!');
    }
};
exports.validateAssetConnectorInstance = (instance) => {
    const keys = ['download', 'delete', 'unpublish'];
    keys.forEach((fn) => {
        if (!(fn in instance) || typeof instance[fn] !== 'function') {
            throw new Error(`${JSON.stringify(instance)} connector does not have ${fn}`);
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
    requiredUpsertKeys.forEach((key) => {
        if (!(key in asset)) {
            throw new Error(`${key} is missing in asset publish!`);
        }
    });
};
exports.validateEntryPublish = (entry) => {
    requiredUpsertKeys.forEach((key) => {
        if (!(key in entry)) {
            throw new Error(`${key} is missing in entry publish!`);
        }
    });
};
exports.validateEntryRemove = (entry) => {
    requiredRemoveKeys.forEach((key) => {
        if (!(key in entry)) {
            throw new Error(`${key} is missing in entry unpublish/delete!`);
        }
    });
};
exports.validateAssetUnpublish = (asset) => {
    requiredRemoveKeys.forEach((key) => {
        if (!(key in asset)) {
            throw new Error(`${key} is missing in asset unpublish!`);
        }
    });
};
exports.validateAssetDelete = (asset) => {
    requiredRemoveKeys.forEach((key) => {
        if (!(key in asset)) {
            throw new Error(`${key} is missing in asset delete!`);
        }
    });
};
exports.validateContentTypeDelete = (contentType) => {
    const keys = ['_content_type_uid', 'uid'];
    keys.forEach((key) => {
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
    const requiredFn = ['info', 'warn', 'log', 'error'];
    requiredFn.forEach((name) => {
        if (typeof instance[name] !== 'function') {
            console.warn(`Unable to register custom logger since '${name}()' does not exist on ${instance}!`);
            flag = true;
        }
    });
    return !flag;
};
