/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import { Db, MongoClient } from 'mongodb'
import { logger } from './util/logger'
import { validateMongodbConfig } from './util/validations'

interface IMongo {
  db: Db,
  client: any
}

const indexes = {
  content_type_uid: 1,
  locales: 1,
  uid: 1,
}

const instance: IMongo = ({} as any)

/**
 * @summary
 * {Singleton}: Establishes connection to mongodb
 * @description
 * Handles config validation and connection establishment with mongo server.
 * Also, creates indexes on connection
 * @param {Object} config - Content connector config
 */
export const connect = (config) => {
  return new Promise((resolve, reject) => {
    try {
      if (Object.keys(instance).length !== 0) {
        return resolve(instance)
      }
      const mongoConfig = config['content-connector']
      validateMongodbConfig(mongoConfig)
      const connectionUri = mongoConfig.uri
      const dbName = mongoConfig.dbName
      const options = mongoConfig.options
      const client = new MongoClient(connectionUri, options)

      return client.connect().then(() => {
        instance.db = client.db(dbName)

        instance.db.collection('contents').createIndex(indexes).then(() => {
          logger.info(`Mongodb connection to ${connectionUri} established successfully!`)
          instance.client = client

          return resolve(instance)
        }).catch(reject)
      }).catch(reject)
    } catch (error) {
      return reject(error)
    }
  })
}
