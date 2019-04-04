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
const index_1 = require("./util/index");
const validations_1 = require("./util/validations");
const debug = debug_1.default('mongodb-core');
let mongo = null;
class Mongodb {
    constructor(mongodb, assetStore, config = { collectionName: 'contents' }) {
        if (!mongo) {
            this.assetStore = assetStore;
            this.db = mongodb.db;
            this.client = mongodb.client;
            this.collectionName = (config && config.collectionName) ? config.collectionName : 'contents';
            mongo = this;
        }
        return mongo;
    }
    publish(data) {
        return new Promise((resolve, reject) => {
            try {
                if (data.content_type_uid === '_assets') {
                    return this.publishAsset(data)
                        .then(resolve)
                        .catch(reject);
                }
                return this.publishEntry(data)
                    .then(resolve)
                    .catch(reject);
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
                data = index_1.filterAssetKeys(data);
                return this.assetStore.download(data).then((asset) => {
                    debug(`Asset download result ${JSON.stringify(asset)}`);
                    asset = index_1.structuralChanges(asset);
                    return this.db.collection(this.collectionName)
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
                        return resolve(data);
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
                let contentType;
                validations_1.validateEntryPublish(data);
                let entry = {
                    content_type_uid: data.content_type_uid,
                    data: data.data,
                    locale: data.locale,
                    uid: data.uid,
                };
                if (data.hasOwnProperty('content_type')) {
                    contentType = {
                        content_type_uid: '_content_types',
                        data: data.content_type,
                        uid: data.content_type_uid,
                    };
                    contentType = index_1.filterContentTypeKeys(contentType);
                    contentType = index_1.structuralChanges(contentType);
                }
                entry = index_1.filterEntryKeys(entry);
                entry = index_1.structuralChanges(entry);
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
                    if (typeof contentType === 'object') {
                        return this.db.collection(this.collectionName)
                            .updateOne({
                            content_type_uid: contentType.content_type_uid,
                            uid: contentType.uid,
                        }, {
                            $set: contentType,
                        }, {
                            upsert: true,
                        })
                            .then((contentTypeUpdateResult) => {
                            debug(`Content type publish result ${contentTypeUpdateResult}`);
                            return resolve(data);
                        });
                    }
                    return resolve(data);
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
                    return this.unpublishAsset(data)
                        .then(resolve)
                        .catch(reject);
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
                    return this.deleteAsset(data)
                        .then(resolve)
                        .catch(reject);
                }
                else if (data.content_type_uid === '_content_types') {
                    return this.deleteContentType(data)
                        .then(resolve)
                        .catch(reject);
                }
                return this.deleteEntry(data)
                    .then(resolve)
                    .catch(reject);
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
                return this.db.collection(this.collectionName)
                    .findOneAndDelete({
                    content_type_uid: asset.content_type_uid,
                    locale: asset.locale,
                    uid: asset.uid,
                    _version: {
                        $exists: true
                    }
                })
                    .then((result) => {
                    debug(`Asset unpublish status: ${result}`);
                    if (result.value === null) {
                        return resolve(asset);
                    }
                    return this.db.collection(this.collectionName)
                        .find({
                        content_type_uid: asset.content_type_uid,
                        locale: asset.locale,
                        uid: asset.uid,
                        url: asset.data.url,
                        download_id: {
                            $exists: true
                        }
                    })
                        .toArray()
                        .then((assets) => {
                        if (assets.length === 0) {
                            debug(`Only published object of ${JSON.stringify(asset)} was present`);
                            return this.assetStore.unpublish(result.value)
                                .then(() => resolve(result.value));
                        }
                        debug(`Asset existed in pubilshed and RTE/Markdown form. Removed published asset object.`);
                        return resolve(result.value);
                    });
                })
                    .catch(reject);
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
                return this.db.collection(this.collectionName)
                    .findOne({
                    content_type_uid: '_assets',
                    uid: asset.uid,
                    locale: asset.locale
                })
                    .then((result) => {
                    if (asset === null) {
                        debug(`Asset did not exist!`);
                        return resolve(asset);
                    }
                    return this.db.collection(this.collectionName)
                        .deleteMany({
                        uid: asset.uid,
                        locale: asset.locale
                    })
                        .then(() => {
                        return result;
                    });
                })
                    .then((result) => {
                    return this.assetStore.delete(result);
                })
                    .then(resolve)
                    .catch(reject);
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
