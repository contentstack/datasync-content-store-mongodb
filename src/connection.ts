/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import Debug from 'debug'
import { isEmpty, isPlainObject, merge } from 'lodash'
import { Db, MongoClient } from 'mongodb'
import { validateMongodbConfig } from './util/validations'
import { MESSAGES } from './util/messages'

const debug = Debug('connection')
interface IMongo {
  db: Db,
  client: any
}

let indexes = {
  _content_type_uid: 1,
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
      const mongoConfig = config.contentStore
      validateMongodbConfig(mongoConfig)
      const connectionUri = mongoConfig.url || mongoConfig.uri
      const dbName = mongoConfig.dbName
      const options = mongoConfig.options

      debug(MESSAGES.CONNECTION.URL, connectionUri)
      debug(MESSAGES.CONNECTION.DB_NAME, dbName)
      debug(MESSAGES.CONNECTION.COLLECTION_NAMES, mongoConfig.collection)
      debug(MESSAGES.CONNECTION.DB_OPTIONS, JSON.stringify(options))

      if (mongoConfig.indexes && isPlainObject(mongoConfig.indexes) && !(isEmpty(mongoConfig.indexes))) {
        indexes = merge(indexes, mongoConfig.indexes)
      }

      const client = new MongoClient(connectionUri, options)

      return client.connect().then(() => {
        instance.db = client.db(dbName)
        instance.client = client
        console.info(MESSAGES.CONNECTION.SUCCESS(connectionUri))

        return resolve(instance)
      })
      .catch(reject)
    } catch (error) {
      return reject(error)
    }
  })
}
