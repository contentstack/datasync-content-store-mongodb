"use strict";
/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const lodash_1 = require("lodash");
const index_1 = require("./util/index");
const validations_1 = require("./util/validations");
const debug = debug_1.default('mongodb-core');
let mongo = null;
class Mongodb {
    constructor(mongodb, assetStore, config) {
        if (!mongo) {
            this.assetStore = assetStore;
            this.db = mongodb.db;
            this.client = mongodb.client;
            this.collection = config.collection;
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
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let assetJSON = lodash_1.cloneDeep(data);
                validations_1.validateAssetPublish(assetJSON);
                assetJSON = index_1.filterAssetKeys(assetJSON);
                assetJSON = index_1.structuralChanges(assetJSON);
                if (assetJSON.hasOwnProperty('_version')) {
                    yield this.unpublish(data);
                }
                return this.assetStore.download(assetJSON)
                    .then((asset) => {
                    const query = {
                        uid: asset.uid,
                        locale: asset.locale
                    };
                    if (asset.hasOwnProperty('download_id')) {
                        query.download_id = asset.download_id;
                    }
                    else {
                        query._version = asset._version;
                    }
                    return this.db.collection(this.collection.asset)
                        .updateOne(query, {
                        $set: assetJSON,
                    }, {
                        upsert: true,
                    });
                })
                    .then((result) => {
                    debug(`Asset publish result ${JSON.stringify(result)}`);
                    return resolve(data);
                })
                    .catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    publishEntry(data) {
        debug(`Entry publish called ${JSON.stringify(data)}`);
        return new Promise((resolve, reject) => {
            try {
                let contentType;
                validations_1.validateEntryPublish(data);
                let entry = {
                    _content_type_uid: data.content_type_uid,
                    data: data.data,
                    locale: data.locale,
                    uid: data.uid,
                    event_at: data.event_at,
                    synced_at: data.synced_at,
                };
                if (data.hasOwnProperty('content_type')) {
                    contentType = {
                        _content_type_uid: '_content_types',
                        data: data.content_type,
                        uid: data.content_type_uid,
                    };
                    contentType = index_1.filterContentTypeKeys(contentType);
                    contentType = index_1.structuralChanges(contentType);
                }
                entry = index_1.filterEntryKeys(entry);
                entry = index_1.structuralChanges(entry);
                return this.db.collection(this.collection.entry)
                    .updateOne({
                    _content_type_uid: entry._content_type_uid,
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
                        return this.db.collection(this.collection.schema)
                            .updateOne({
                            _content_type_uid: contentType._content_type_uid,
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
                return this.db.collection(this.collection.entry)
                    .deleteOne({
                    _content_type_uid: entry.content_type_uid,
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
                return this.db.collection(this.collection.entry)
                    .deleteMany({
                    _content_type_uid: entry.content_type_uid,
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
                return this.db.collection(this.collection.asset)
                    .findOneAndDelete({
                    _content_type_uid: asset.content_type_uid,
                    locale: asset.locale,
                    uid: asset.uid,
                    _version: {
                        $exists: true
                    }
                })
                    .then((result) => {
                    debug(`Asset unpublish status: ${JSON.stringify(result)}`);
                    if (result.value === null) {
                        return resolve(asset);
                    }
                    return this.db.collection(this.collection.asset)
                        .find({
                        _content_type_uid: asset.content_type_uid,
                        locale: asset.locale,
                        uid: asset.uid,
                        url: result.value.url,
                        download_id: {
                            $exists: true
                        }
                    })
                        .toArray()
                        .then((assets) => {
                        if (assets.length === 0) {
                            debug(`Only published object of ${JSON.stringify(asset)} was present`);
                            return this.assetStore.unpublish(result.value)
                                .then(() => resolve(asset));
                        }
                        debug(`Asset existed in pubilshed and RTE/Markdown form. Removed published asset object.`);
                        return resolve(asset);
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
                return this.db.collection(this.collection.asset)
                    .find({
                    _content_type_uid: '_assets',
                    uid: asset.uid,
                    locale: asset.locale
                })
                    .toArray()
                    .then((result) => {
                    if (result.length === 0) {
                        debug(`Asset did not exist!`);
                        return resolve(asset);
                    }
                    return this.db.collection(this.collection.asset)
                        .deleteMany({
                        _content_type_uid: '_assets',
                        uid: asset.uid,
                        locale: asset.locale
                    })
                        .then(() => {
                        return result;
                    });
                })
                    .then((result) => {
                    return this.assetStore.delete(result)
                        .then(() => resolve(asset));
                })
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
                return this.db.collection(this.collection.entry)
                    .deleteMany({
                    _content_type_uid: contentType.uid,
                })
                    .then((entriesDeleteResult) => {
                    debug(`Delete entries result ${JSON.stringify(entriesDeleteResult)}`);
                    return this.db.collection(this.collection.schema)
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
