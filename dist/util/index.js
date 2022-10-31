"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalesFromCollections = exports.getCollectionName = exports.filterContentTypeKeys = exports.filterEntryKeys = exports.filterAssetKeys = exports.sanitizeConfig = void 0;
const index_1 = require("../index");
const sanitizeConfig = (config) => {
    if (typeof config.contentStore.collectionName === 'string' && config.contentStore.collectionName.length) {
        config.contentStore.collection.entry = config.contentStore.collectionName;
        config.contentStore.collection.asset = config.contentStore.collectionName;
        config.contentStore.collection.schema = config.contentStore.collectionName;
        delete config.contentStore.collectionName;
    }
    return config;
};
exports.sanitizeConfig = sanitizeConfig;
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
    const contentStore = (0, index_1.getConfig)().contentStore;
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
const filterAssetKeys = (asset) => {
    return filter('asset', asset);
};
exports.filterAssetKeys = filterAssetKeys;
const filterEntryKeys = (entry) => {
    return filter('entry', entry);
};
exports.filterEntryKeys = filterEntryKeys;
const filterContentTypeKeys = (contentType) => {
    return filter('contentType', contentType);
};
exports.filterContentTypeKeys = filterContentTypeKeys;
const getCollectionName = ({ locale, _content_type_uid }) => {
    const collection = (0, index_1.getConfig)().contentStore.collection;
    switch (_content_type_uid) {
        case '_assets':
            return `${locale}.${collection.asset}`;
        case '_content_types':
            return `${locale}.${collection.schema}`;
        default:
            return `${locale}.${collection.entry}`;
    }
};
exports.getCollectionName = getCollectionName;
const getLocalesFromCollections = (collections) => {
    const collectionConfig = (0, index_1.getConfig)().contentStore.collection;
    const collectionDetails = [];
    collections.forEach((collection) => {
        const name = collection.name;
        const namedArr = name.split('.');
        const locale = namedArr.splice(0, 1)[0];
        if (namedArr.length > 0) {
            const newCollectionName = namedArr.join('.');
            if (newCollectionName === collectionConfig.schema) {
                collectionDetails.push({
                    name: collection.name,
                    locale
                });
            }
        }
    });
    return collectionDetails;
};
exports.getLocalesFromCollections = getLocalesFromCollections;
