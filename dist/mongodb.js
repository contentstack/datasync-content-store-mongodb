"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const core_utilities_1 = require("./util/core-utilities");
const validations_1 = require("./util/validations");
const debug = debug_1.default('mongodb-core');
let mongo = null;
class Mongodb {
    constructor(mongodb, connector) {
        if (!mongo) {
            this.assetConnector = connector;
            this.db = mongodb.db;
            this.client = mongodb.client;
            this.collectionName = 'contents';
            mongo = this;
        }
        return mongo;
    }
    publish(data) {
        return new Promise((resolve, reject) => {
            try {
                if (data.content_type_uid === '_assets') {
                    return this.publishAsset(data).then(resolve).catch(reject);
                }
                return this.publishEntry(data).then(resolve).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    publishAsset(data) {
        debug(`Asset publish called ${JSON.stringify(data)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateAssetPublish(data);
                data = core_utilities_1.filterAssetKeys(data);
                return this.assetConnector.download(data).then((asset) => {
                    debug(`Asset download result ${JSON.stringify(asset)}`);
                    this.db.collection(this.collectionName)
                        .updateOne({
                        locale: asset.locale,
                        uid: asset.uid,
                    }, {
                        $set: asset,
                    }, {
                        upsert: true,
                    })
                        .then((result) => {
                        debug(`Asset publish result ${JSON.stringify(result)}`);
                        return resolve(asset);
                    });
                }).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    publishEntry(data) {
        debug(`Entry publish called ${JSON.stringify(data)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateEntryPublish(data);
                let entry = {
                    content_type_uid: data.content_type_uid,
                    data: data.data,
                    locale: data.locale,
                    uid: data.uid,
                };
                let contentType = {
                    content_type_uid: 'contentTypes',
                    data: data.content_type,
                    uid: data.content_type_uid,
                };
                entry = core_utilities_1.filterEntryKeys(entry);
                contentType = core_utilities_1.filterContentTypeKeys(contentType);
                return this.db.collection(this.collectionName)
                    .updateOne({
                    content_type_uid: entry.content_type_uid,
                    locale: entry.locale,
                    uid: entry.uid,
                }, {
                    $set: entry,
                }, {
                    upsert: true,
                })
                    .then((entryPublishResult) => {
                    debug(`Entry publish result ${entryPublishResult}`);
                    return this.db.collection(this.collectionName)
                        .updateOne({
                        uid: contentType.content_type_uid,
                    }, {
                        $set: contentType,
                    }, {
                        upsert: true,
                    })
                        .then((contentTypeUpdateResult) => {
                        debug(`Content type publish result ${contentTypeUpdateResult}`);
                        return resolve(data);
                    });
                }).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    unpublish(data) {
        return new Promise((resolve, reject) => {
            try {
                if (data.content_type_uid === '_assets') {
                    return this.unpublishAsset(data).then(resolve).catch(reject);
                }
                return this.unpublishEntry(data).then(resolve).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    delete(data) {
        return new Promise((resolve, reject) => {
            try {
                if (data.content_type_uid === '_assets') {
                    return this.deleteAsset(data).then(resolve).catch(reject);
                }
                else if (data.content_type_uid === '_content_types') {
                    return this.deleteContentType(data).then(resolve).catch(reject);
                }
                return this.deleteEntry(data).then(resolve).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    find(data) {
        return new Promise((resolve, reject) => {
            try {
                return resolve(data);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    findOne(data) {
        return new Promise((resolve, reject) => {
            try {
                return resolve(data);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    unpublishEntry(entry) {
        debug(`Delete entry called ${JSON.stringify(entry)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateEntryRemove(entry);
                return this.db.collection(this.collectionName)
                    .deleteOne({
                    content_type_uid: entry.content_type_uid,
                    locale: entry.locale,
                    uid: entry.uid,
                })
                    .then((result) => {
                    debug(`Delete entry result ${result}`);
                    return resolve(entry);
                }).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    deleteEntry(entry) {
        debug(`Delete entry called ${JSON.stringify(entry)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateEntryRemove(entry);
                return this.db.collection(this.collectionName)
                    .deleteMany({
                    content_type_uid: entry.content_type_uid,
                    uid: entry.uid,
                })
                    .then((result) => {
                    debug(`Delete entry result ${result}`);
                    return resolve(entry);
                }).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    unpublishAsset(asset) {
        debug(`Unpublish asset called ${JSON.stringify(asset)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateAssetUnpublish(asset);
                return this.assetConnector.unpublish(asset).then(() => {
                    return this.db.collection(this.collectionName)
                        .deleteOne({
                        content_type_uid: asset.content_type_uid,
                        uid: asset.uid,
                    })
                        .then((result) => {
                        debug(`Unpublish asset result ${JSON.stringify(result)}`);
                        return resolve(asset);
                    });
                }).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    deleteAsset(asset) {
        debug(`Delete asset called ${JSON.stringify(asset)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateAssetDelete(asset);
                return this.assetConnector.delete(asset).then(() => {
                    return this.db.collection(this.collectionName)
                        .deleteMany({
                        'data.uid': asset.uid,
                    })
                        .then((result) => {
                        debug(`Delete asset result ${JSON.stringify(result)}`);
                        return resolve(asset);
                    });
                }).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    deleteContentType(contentType) {
        debug(`Delete content type called ${JSON.stringify(contentType)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateContentTypeDelete(contentType);
                return this.db.collection(this.collectionName)
                    .deleteMany({
                    content_type_uid: contentType.uid,
                })
                    .then((entriesDeleteResult) => {
                    debug(`Delete entries result ${JSON.stringify(entriesDeleteResult)}`);
                    return this.db.collection(this.collectionName)
                        .deleteOne({
                        uid: contentType.uid,
                    })
                        .then((contentTypeDeleteResult) => {
                        debug(`Content type delete result ${JSON.stringify(contentTypeDeleteResult)}`);
                        return resolve(contentType);
                    });
                }).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
}
exports.Mongodb = Mongodb;
//# sourceMappingURL=mongodb.js.map