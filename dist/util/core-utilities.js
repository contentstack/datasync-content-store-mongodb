"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
const assetFilterKeys = ['type', 'event_at', 'checkpoint', 'action'];
const entryFilterKeys = ['type', 'event_at', 'checkpoint', 'action'];
const contentTypeFilterKeys = ['type', 'event_at', 'checkpoint', 'action'];
exports.filterAssetKeys = (asset) => {
    assetFilterKeys.forEach((key) => {
        delete asset[key];
    });
    return asset;
};
exports.filterEntryKeys = (entry) => {
    entryFilterKeys.forEach((key) => {
        delete entry[key];
    });
    return entry;
};
exports.filterContentTypeKeys = (contentType) => {
    contentTypeFilterKeys.forEach((key) => {
        delete contentType[key];
    });
    return contentType;
};
//# sourceMappingURL=core-utilities.js.map