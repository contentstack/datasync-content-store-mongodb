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
  contentStore: {
    dbName: 'contentstack-persistent-db',
    indexes: {
      published_at: 1,
      content_type_uid: 1,
      locale: 1,
      uid: 1
    },
    // http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
    options: {
      autoReconnect: true,
      connectTimeoutMS: 15000,
      keepAlive: true,
      noDelay: true,
      reconnectInterval: 1000,
      reconnectTries: 20,
      useNewUrlParser: true,
    },
    // keys that form part of sys_keys, pass { key: true } to add, { key: false } to remove
    // currently, only top level keys from SYNC API response item are supported
    indexedKeys: {
      content_type_uid: true,
      locale: true,
      uid: true,
      published_at: true
    },
    unwantedKeys: {
      asset: {
        action: true,
        checkpoint: true,
        'data.created_by': true,
        event_at: true,
        type: true, 
        'data.updated_by': true
      },
      contentType: {
        'data.created_by': true, 
        'data.updated_by': true, 
        'data.DEFAULT_ACL': true,
        'data.SYS_ACL': true, 
        'data.abilities': true,
        'data.last_activity': true
      },
      entry: {
        action: true,
        checkpoint: true,
        'data.created_by': true,
        event_at: true,
        type: true, 
        'data.updated_by': true
      },
    },
    uri: 'mongodb://localhost:27017',
  },
}
