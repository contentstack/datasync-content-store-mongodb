"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const core_utilities_1 = require("./util/core-utilities");
const stringify_1 = require("./util/stringify");
const validations_1 = require("./util/validations");
const debug = debug_1.default('mongodb-core');
let mongo = null;
class Mongodb {
    constructor(mongodb, connector) {
        if (!mongo) {
            this.assetConnector = connector;
            this.db = mongodb.db;
            this.client = mongodb.client;
            this.assetCollectionName = 'assets';
            this.entryCollectionName = 'entries';
            this.contentTypeCollectionName = 'content_types';
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
        debug(`Asset publish called ${stringify_1.stringify(data)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateAssetPublish(data);
                core_utilities_1.filterAssetKeys(data);
                return this.assetConnector.download(data).then((asset) => {
                    debug(`Asset download result ${stringify_1.stringify(asset)}`);
                    this.db.collection(this.assetCollectionName)
                        .updateOne({
                        locale: asset.locale,
                        uid: asset.uid,
                    }, {
                        $set: asset,
                    }, {
                        upsert: true,
                    })
                        .then((result) => {
                        debug(`Asset publish result ${stringify_1.stringify(result)}`);
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
        debug(`Entry publish called ${stringify_1.stringify(data)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateEntryPublish(data);
                const entry = {
                    content_type_uid: data.content_type_uid,
                    data: data.data,
                    locale: data.locale,
                    uid: data.uid,
                };
                const contentType = {
                    content_type_uid: 'contentTypes',
                    data: data.content_type,
                    locale: data.locale,
                    uid: data.content_type_uid,
                };
                core_utilities_1.filterEntryKeys(entry);
                core_utilities_1.filterContentTypeKeys(contentType);
                return this.db.collection(this.entryCollectionName)
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
                    return this.db.collection(this.contentTypeCollectionName)
                        .updateOne({
                        locale: contentType.locale,
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
        debug(`Delete entry called ${stringify_1.stringify(entry)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateEntryRemove(entry);
                return this.db.collection(this.entryCollectionName)
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
        debug(`Delete entry called ${stringify_1.stringify(entry)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateEntryRemove(entry);
                return this.db.collection(this.entryCollectionName)
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
        debug(`Unpublish asset called ${stringify_1.stringify(asset)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateAssetUnpublish(asset);
                return this.assetConnector.unpublish(asset).then(() => {
                    return this.db.collection(this.assetCollectionName)
                        .deleteOne({
                        content_type_uid: asset.content_type_uid,
                        uid: asset.uid,
                    })
                        .then((result) => {
                        debug(`Unpublish asset result ${stringify_1.stringify(result)}`);
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
        debug(`Delete asset called ${stringify_1.stringify(asset)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateAssetDelete(asset);
                return this.assetConnector.delete(asset).then(() => {
                    return this.db.collection(this.assetCollectionName)
                        .deleteMany({
                        data: {
                            uid: asset.uid,
                        },
                    })
                        .then((result) => {
                        debug(`Delete asset result ${stringify_1.stringify(result)}`);
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
        debug(`Delete content type called ${stringify_1.stringify(contentType)}`);
        return new Promise((resolve, reject) => {
            try {
                validations_1.validateContentTypeDelete(contentType);
                return this.db.collection(this.entryCollectionName)
                    .deleteMany({
                    content_type_uid: contentType.uid,
                })
                    .then((entriesDeleteResult) => {
                    debug(`Delete entries result ${stringify_1.stringify(entriesDeleteResult)}`);
                    return this.db.collection(this.contentTypeCollectionName)
                        .deleteOne({
                        uid: contentType.uid,
                    })
                        .then((contentTypeDeleteResult) => {
                        debug(`Content type delete result ${stringify_1.stringify(contentTypeDeleteResult)}`);
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