"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const logger_1 = require("./util/logger");
const promise_map_1 = require("./util/promise.map");
const validations_1 = require("./util/validations");
const indexes = {
    content_type_uid: 1,
    locales: 1,
    uid: 1,
};
const collections = ['entries', 'assets', 'content_types'];
let db = null;
exports.connect = (config) => {
    return new Promise((resolve, reject) => {
        try {
            if (!db) {
                const mongoConfig = config['content-connector'];
                validations_1.validateMongodbConfig(mongoConfig);
                const connectionUri = mongoConfig.uri;
                const dbName = mongoConfig.dbName;
                const options = mongoConfig.options;
                const client = new mongodb_1.MongoClient(connectionUri, options);
                return client.connect().then(() => {
                    db = client.db(dbName);
                    return promise_map_1.map(collections, (collection) => {
                        return new Promise((mapResolve, mapReject) => {
                            return db.collection(collection).createIndex(indexes)
                                .then(mapResolve)
                                .catch(mapReject);
                        });
                    }, 2).then(() => {
                        logger_1.logger.info(`Mongodb connection to ${connectionUri} established successfully!`);
                        return resolve({
                            client,
                            db,
                        });
                    });
                }).catch(reject);
            }
            return resolve(db);
        }
        catch (error) {
            reject(error);
        }
    });
};
//# sourceMappingURL=connection.js.map