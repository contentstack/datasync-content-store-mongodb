"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContentTypeUpdate = exports.validateContentTypeDelete = exports.validateAssetDelete = exports.validateAssetUnpublish = exports.validateEntryRemove = exports.validateEntryPublish = exports.validateAssetPublish = exports.validateMongodbConfig = exports.validateAssetConnectorInstance = exports.validateConfig = void 0;
const requiredUpsertKeys = ['_content_type_uid', 'locale', 'uid'];
const requiredRemoveKeys = ['_content_type_uid', 'locale', 'uid'];
const validateConfig = (config) => {
    if (typeof config.contentStore.options !== 'object' || Object.keys(config.contentStore.options).length
        === 0) {
        throw new Error('Content connector options cannot be empty!');
    }
    else if (typeof config.contentStore.uri !== 'string' || config.contentStore.uri.length === 0) {
        throw new Error('Content connector uri should be of type string and not empty!');
    }
};
exports.validateConfig = validateConfig;
const validateAssetConnectorInstance = (instance) => {
    const keys = ['download', 'delete', 'unpublish'];
    keys.forEach((fn) => {
        if (!(fn in instance) || typeof instance[fn] !== 'function') {
            throw new Error(`${JSON.stringify(instance)} connector does not have ${fn}`);
        }
    });
};
exports.validateAssetConnectorInstance = validateAssetConnectorInstance;
const validateMongodbConfig = (config = {}) => {
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
exports.validateMongodbConfig = validateMongodbConfig;
const validateAssetPublish = (asset) => {
    requiredUpsertKeys.forEach((key) => {
        if (!(key in asset)) {
            throw new Error(`${key} is missing in asset publish!`);
        }
    });
};
exports.validateAssetPublish = validateAssetPublish;
const validateEntryPublish = (entry) => {
    requiredUpsertKeys.forEach((key) => {
        if (!(key in entry)) {
            throw new Error(`${key} is missing in entry publish!`);
        }
    });
};
exports.validateEntryPublish = validateEntryPublish;
const validateEntryRemove = (entry) => {
    requiredRemoveKeys.forEach((key) => {
        if (!(key in entry)) {
            throw new Error(`${key} is missing in entry unpublish/delete!`);
        }
    });
};
exports.validateEntryRemove = validateEntryRemove;
const validateAssetUnpublish = (asset) => {
    requiredRemoveKeys.forEach((key) => {
        if (!(key in asset)) {
            throw new Error(`${key} is missing in asset unpublish!`);
        }
    });
};
exports.validateAssetUnpublish = validateAssetUnpublish;
const validateAssetDelete = (asset) => {
    requiredRemoveKeys.forEach((key) => {
        if (!(key in asset)) {
            throw new Error(`${key} is missing in asset delete!`);
        }
    });
};
exports.validateAssetDelete = validateAssetDelete;
const validateContentTypeDelete = (contentType) => {
    const keys = ['_content_type_uid', 'uid'];
    keys.forEach((key) => {
        if (!(key in contentType)) {
            throw new Error(`${key} is missing in content type delete!`);
        }
    });
};
exports.validateContentTypeDelete = validateContentTypeDelete;
const validateContentTypeUpdate = (contentType) => {
    requiredUpsertKeys.forEach((key) => {
        if (!(key in contentType)) {
            throw new Error(`${key} is missing in content type upsert!`);
        }
    });
};
exports.validateContentTypeUpdate = validateContentTypeUpdate;
