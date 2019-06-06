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
    collection: {
      entry: 'contents',
      asset: 'contents',
      schema: 'contents'
    },
    indexes: {
      _content_type_uid: 1,
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
    unwantedKeys: {
      asset: {
        type: true,
        _checkpoint: true,
        created_by: true,
        _event_at: true,
        updated_by: true,
        publish_details: true,
      },
      contentType: {
        created_by: true,
        updated_by: true,
        DEFAULT_ACL: true,
        SYS_ACL: true,
        abilities: true,
        last_activity: true,
      },
      entry: {
        type: true,
        _checkpoint: true,
        created_by: true,
        _event_at: true,
        updated_by: true,
        publish_details: true,
      },
    },
    uri: 'mongodb://localhost:27017',
  },
}
