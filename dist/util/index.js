"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const index_1 = require("../index");
exports.sanitizeConfig = (config) => {
    if (typeof config.contentStore.collectionName === 'string' && config.contentStore.length) {
        config.contentStore.collection.entry = config.contentStore.collectionName;
        config.contentStore.collection.asset = config.contentStore.collectionName;
        config.contentStore.collection.schema = config.contentStore.collectionName;
        delete config.contentStore.collectionName;
    }
    return config;
};
const maskKeys = (json, arr, pos) => {
    const key = arr[pos];
    if (json.hasOwnProperty(key)) {
        if (pos === arr.length - 1) {
            delete json[key];
        }
        else {
            pos++;
            maskKeys(json[key], arr, pos);
        }
    }
    else if (typeof json === 'object' && json instanceof Array && json.length) {
        json.forEach((sub) => {
            maskKeys(sub, arr, pos);
        });
    }
};
const filter = (type, json) => {
    const contentStore = index_1.getConfig().contentStore;
    const unwantedKeys = contentStore.unwantedKeys;
    if (unwantedKeys && unwantedKeys[type] && Object.keys(unwantedKeys[type]).length !== 0) {
        const keyConfig = unwantedKeys[type];
        const filterKeys = Object.keys(keyConfig);
        filterKeys.forEach((key) => {
            if (keyConfig[key]) {
                maskKeys(json, key.split('.'), 0);
            }
        });
    }
    return json;
};
exports.filterAssetKeys = (asset) => {
    return filter('asset', asset);
};
exports.filterEntryKeys = (entry) => {
    return filter('entry', entry);
};
exports.filterContentTypeKeys = (contentType) => {
    return filter('contentType', contentType);
};
exports.structuralChanges = (entity) => {
    const data = lodash_1.cloneDeep(entity.data);
    delete entity.data;
    entity = lodash_1.merge(entity, data);
    return entity;
};
