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
            this.config = config;
            this.client = mongodb.client;
            mongo = this;
        }
        return mongo;
    }
    publish(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            if (data._content_type_uid === '_assets') {
                response = yield this.publishAsset(data);
            }
            else {
                response = yield this.publishEntry(data);
            }
            return response;
        });
    }
    publishAsset(data) {
        debug(`Asset publish called ${JSON.stringify(data)}`);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let assetJSON = lodash_1.cloneDeep(data);
                validations_1.validateAssetPublish(assetJSON);
                assetJSON = index_1.filterAssetKeys(assetJSON);
                if (assetJSON.hasOwnProperty('_version')) {
                    yield this.unpublish(data);
                }
                const asset = yield this.assetStore.download(assetJSON);
                const query = {
                    locale: asset.locale,
                    uid: asset.uid,
                };
                if (asset.hasOwnProperty('download_id')) {
                    query.download_id = asset.download_id;
                }
                else {
                    query._version = asset._version;
                }
                const result = this.db.collection(index_1.getCollectionName(asset))
                    .updateOne(query, {
                    $set: assetJSON,
                }, {
                    upsert: true,
                });
                debug(`Asset publish result ${JSON.stringify(result)}`);
                return resolve(data);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    updateContentType(contentType) {
        debug(`Entry publish called ${JSON.stringify(contentType)}`);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let contentTypeJSON = lodash_1.cloneDeep(contentType);
                validations_1.validateContentTypeUpdate(contentTypeJSON);
                contentTypeJSON = index_1.filterContentTypeKeys(contentTypeJSON);
                const contentTypeUpdateResult = yield this.db
                    .collection(index_1.getCollectionName(contentTypeJSON))
                    .updateOne({
                    _content_type_uid: contentTypeJSON._content_type_uid,
                    uid: contentTypeJSON.uid,
                }, {
                    $set: contentTypeJSON,
                }, {
                    upsert: true,
                });
                debug(`Content type update result ${JSON.stringify(contentTypeUpdateResult)}`);
                return resolve(contentType);
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    publishEntry(entry) {
        debug(`Entry publish called ${JSON.stringify(entry)}`);
        return new Promise((resolve, reject) => {
            try {
                let entryJSON = lodash_1.cloneDeep(entry);
                validations_1.validateEntryPublish(entryJSON);
                entryJSON = index_1.filterEntryKeys(entryJSON);
                return this.db.collection(index_1.getCollectionName(entryJSON))
                    .updateOne({
                    _content_type_uid: entryJSON._content_type_uid,
                    locale: entryJSON.locale,
                    uid: entryJSON.uid,
                }, {
                    $set: entryJSON,
                }, {
                    upsert: true,
                })
                    .then((entryPublishResult) => {
                    debug(`Entry publish result ${JSON.stringify(entryPublishResult)}`);
                    return resolve(entry);
                }).catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    unpublish(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            if (data._content_type_uid === '_assets') {
                result = yield this.unpublishAsset(data);
            }
            else {
                result = yield this.unpublishEntry(data);
            }
            return result;
        });
    }
    delete(data) {
        return new Promise((resolve, reject) => {
            try {
                if (data._content_type_uid === '_assets') {
                    return this.deleteAsset(data)
                        .then(resolve)
                        .catch(reject);
                }
                else if (data._content_type_uid === '_content_types') {
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
                return this.db.collection(index_1.getCollectionName(entry))
                    .deleteOne({
                    _content_type_uid: entry._content_type_uid,
                    locale: entry.locale,
                    uid: entry.uid,
                })
                    .then((result) => {
                    debug(`Delete entry result ${JSON.stringify(result)}`);
                    return resolve(entry);
                })
                    .catch(reject);
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
                return this.db.collection(index_1.getCollectionName(entry))
                    .deleteMany({
                    _content_type_uid: entry._content_type_uid,
                    uid: entry.uid,
                })
                    .then((result) => {
                    debug(`Delete entry result ${JSON.stringify(result)}`);
                    return resolve(entry);
                })
                    .catch(reject);
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
                return this.db.collection(index_1.getCollectionName(asset))
                    .findOneAndDelete({
                    _content_type_uid: asset._content_type_uid,
                    _version: {
                        $exists: true,
                    },
                    locale: asset.locale,
                    uid: asset.uid,
                })
                    .then((result) => {
                    debug(`Asset unpublish status: ${JSON.stringify(result)}`);
                    if (result.value === null) {
                        return resolve(asset);
                    }
                    return this.db.collection(index_1.getCollectionName(asset))
                        .find({
                        _content_type_uid: asset._content_type_uid,
                        download_id: {
                            $exists: true,
                        },
                        locale: asset.locale,
                        uid: asset.uid,
                        url: result.value.url,
                    })
                        .toArray()
                        .then((assets) => {
                        if (assets.length === 0) {
                            debug(`Only published object of ${JSON.stringify(asset)} was present`);
                            return this.assetStore.unpublish(result.value)
                                .then(() => resolve(asset));
                        }
                        debug('Asset existed in pubilshed and RTE/Markdown form. Removed published asset object.');
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
                return this.db.collection(index_1.getCollectionName(asset))
                    .find({
                    _content_type_uid: '_assets',
                    locale: asset.locale,
                    uid: asset.uid,
                })
                    .toArray()
                    .then((result) => {
                    if (result.length === 0) {
                        debug('Asset did not exist!');
                        return resolve(asset);
                    }
                    return this.db.collection(index_1.getCollectionName(asset))
                        .deleteMany({
                        _content_type_uid: '_assets',
                        locale: asset.locale,
                        uid: asset.uid,
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
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                validations_1.validateContentTypeDelete(contentType);
                const collectionsResult = yield this.db
                    .listCollections({}, { nameOnly: true })
                    .toArray();
                if (collectionsResult.length === 0) {
                    return resolve(contentType);
                }
                const collections = index_1.getLocalesFromCollections(collectionsResult);
                const promisifiedBucket = [];
                collections.forEach((collection) => {
                    promisifiedBucket.push(this.deleteCT(contentType.uid, collection));
                });
                return Promise.all(promisifiedBucket)
                    .then(() => resolve(contentType));
            }
            catch (error) {
                return reject(error);
            }
        }));
    }
    deleteCT(uid, collection) {
        return new Promise((resolve, reject) => {
            try {
                return this.db.collection(index_1.getCollectionName({ _content_type_uid: uid, locale: collection.locale }))
                    .deleteMany({
                    _content_type_uid: uid,
                })
                    .then((entriesDeleteResult) => {
                    debug(`Delete entries result ${JSON.stringify(entriesDeleteResult)}`);
                    return this.db.collection(collection.name)
                        .deleteOne({
                        _content_type_uid: '_content_types',
                        uid,
                    })
                        .then((contentTypeDeleteResult) => {
                        debug(`Content type delete result ${JSON.stringify(contentTypeDeleteResult)}`);
                        return resolve();
                    });
                })
                    .catch(reject);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
}
exports.Mongodb = Mongodb;
