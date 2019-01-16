/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

/**
 * @description
 *  Internal default config. This can be overriden!
 */
export const config = {
  'content-connector': {
    dbName: 'contentstack-persistent-db',
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
    uri: 'mongodb://localhost:27017',
  },
}
