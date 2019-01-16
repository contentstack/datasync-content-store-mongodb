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
};
exports.filterEntryKeys = (entry) => {
    entryFilterKeys.forEach((key) => {
        delete entry[key];
    });
};
exports.filterContentTypeKeys = (contentType) => {
    contentTypeFilterKeys.forEach((key) => {
        delete contentType[key];
    });
};
//# sourceMappingURL=core-utilities.js.map