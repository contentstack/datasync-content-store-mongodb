/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

/**
 * @summary
 *  Internal default config. This can be overriden!
 */
export const config = {
  'content-connector': {
    dbName: 'contentstack-persistent-db',
    indexes: {
      published_at: 1,
    },
    // http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
    options: {
      autoReconnect: true,
      connectTimeoutMS: 15000,
      keepAlive: true,
      noDelay: true,
      reconnectInterval: 1000,
      reconnectTries: 20,
      userNewUrlParser: true,
    },
    unwantedKeys: {
      asset: ['created_by', 'updated_by'],
      contentType: ['created_by', 'updated_by', 'DEFAULT_ACL', 'SYS_ACL', 'abilities', 'last_activity'],
      entry: ['created_by', 'updated_by'],
    },
    uri: 'mongodb://localhost:27017',
  },
}
