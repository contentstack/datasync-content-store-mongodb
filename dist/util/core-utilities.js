"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const __1 = require("..");
const assetFilterKeys = ['type', 'event_at', 'checkpoint', 'action'];
const entryFilterKeys = ['type', 'event_at', 'checkpoint', 'action'];
const contentTypeFilterKeys = ['type', 'event_at', 'checkpoint', 'action'];
const indexedKeys = ['content_type_uid', 'locale', 'uid', 'published_at'];
exports.filterAssetKeys = (asset) => {
    const config = __1.getConfig();
    assetFilterKeys.forEach((key) => {
        delete asset[key];
    });
    const unwantedKeys = config['content-connector'].unwantedKeys;
    if (unwantedKeys && unwantedKeys.asset && unwantedKeys.asset.length !== 0) {
        unwantedKeys.asset.forEach((key) => {
            delete asset.data[key];
        });
    }
    return asset;
};
exports.filterEntryKeys = (entry) => {
    const config = __1.getConfig();
    entryFilterKeys.forEach((key) => {
        delete entry[key];
    });
    const unwantedKeys = config['content-connector'].unwantedKeys;
    if (unwantedKeys && unwantedKeys.entry && unwantedKeys.entry.length !== 0) {
        unwantedKeys.entry.forEach((key) => {
            delete entry.data[key];
        });
    }
    return entry;
};
exports.filterContentTypeKeys = (contentType) => {
    const config = __1.getConfig();
    contentTypeFilterKeys.forEach((key) => {
        delete contentType[key];
    });
    const unwantedKeys = config['content-connector'].unwantedKeys;
    if (unwantedKeys && unwantedKeys.contentType && unwantedKeys.contentType.length !== 0) {
        unwantedKeys.contentType.forEach((key) => {
            delete contentType.data[key];
        });
    }
    return contentType;
};
exports.structuralChanges = (entity) => {
    const clone = lodash_1.cloneDeep(entity.data);
    const obj = {};
    indexedKeys.forEach((key) => {
        if (lodash_1.hasIn(entity, key)) {
            obj[key] = entity[key];
            clone[key] = entity[key];
        }
    });
    if (lodash_1.hasIn(clone, 'publish_details')) {
        clone.published_at = clone.publish_details.time;
        clone.locale = clone.publish_details.locale;
        delete clone.publish_details;
    }
    else {
        clone.published_at = new Date().toISOString();
    }
    clone.sys_keys = obj;
    return clone;
};
