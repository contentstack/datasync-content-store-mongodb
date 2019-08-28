/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

/**
 * @summary
 * Internal default config. This can be overriden!
 */
export const config = {
  contentStore: {
    collection: {
      asset: 'contents',
      entry: 'contents',
      schema: 'contents',
    },
    // Proposed
    // db: {
    //   name: 'contentstack-db',
    //   // this can be provided via environment MONGO_PASSWD
    //   password: '',
    //   servers: [
    //     {
    //       host: '',
    //       port: '',
    //     },
    //   ],
    //   // this can be provided via environment MONGO_UNAME
    //   username: '',
    // },
    dbName: 'contentstack-db',
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
        _checkpoint: true,
        _event_at: true,
        _workflow: true,
        created_by: true,
        publish_details: true,
        _type: true,
        updated_by: true,
      },
      contentType: {
        DEFAULT_ACL: true,
        SYS_ACL: true,
        _workflow: true,
        abilities: true,
        created_by: true,
        last_activity: true,
        updated_by: true,
      },
      entry: {
        _checkpoint: true,
        _event_at: true,
        _workflow: true,
        created_by: true,
        publish_details: true,
        _type: true,
        updated_by: true,
      },
    },
    uri: 'mongodb://localhost:27017',
  },
}
