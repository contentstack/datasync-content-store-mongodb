"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const index_1 = require("../index");
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
    const contentStore = index_1.getConfig().contentStore;
    const indexedKeys = contentStore.indexedKeys;
    if (indexedKeys && typeof indexedKeys === 'object' && Object.keys(indexedKeys).length) {
        let clone = lodash_1.cloneDeep(entity.data);
        const obj = {};
        obj.synced_at = new Date().toISOString();
        clone.synced_at = obj.synced_at;
        for (let key in indexedKeys) {
            if (indexedKeys[key]) {
                if (lodash_1.hasIn(entity, key)) {
                    obj[key] = entity[key];
                    clone[key] = entity[key];
                }
            }
        }
        if (lodash_1.hasIn(clone, 'publish_details')) {
            clone.published_at = clone.publish_details.time;
            clone.locale = clone.publish_details.locale;
            delete clone.publish_details;
        }
        else {
            clone.published_at = new Date().toISOString();
        }
        clone = lodash_1.merge(clone, obj);
        return clone;
    }
    return entity;
};
exports.buildReferences = (schema, references = {}, parent) => {
    for (let i = 0, l = schema.length; i < l; i++) {
        if (schema[i] && schema[i].data_type && schema[i].data_type === 'reference') {
            const field = ((parent) ? `${parent}.${schema[i].uid}` : schema[i].uid);
            references[field] = schema[i].reference_to;
        }
        else if (schema[i] && schema[i].data_type && schema[i].data_type === 'group' && schema[i].schema) {
            exports.buildReferences(schema[i].schema, references, ((parent) ? `${parent}.${schema[i].uid}` : schema[i].uid));
        }
    }
    return references;
};
