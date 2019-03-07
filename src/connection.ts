/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import Debug from 'debug'
import { isEmpty, isPlainObject, merge } from 'lodash'
import { Db, MongoClient } from 'mongodb'
import { logger } from './util/logger'
import { validateMongodbConfig } from './util/validations'

const debug = Debug('connection')
interface IMongo {
  db: Db,
  client: any
}

let indexes = {
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
      const mongoConfig = config.contentStore
      validateMongodbConfig(mongoConfig)
      const connectionUri = mongoConfig.url || mongoConfig.uri
      const dbName = mongoConfig.dbName
      const collectionName = mongoConfig.collectionName
      const options = mongoConfig.options

      debug('connection url', connectionUri)
      debug('db name', dbName)
      debug('collection name', collectionName)
      debug('db options', JSON.stringify(options))

      if (mongoConfig.indexes && isPlainObject(mongoConfig.indexes) && !(isEmpty(mongoConfig.indexes))) {
        indexes = merge(indexes, mongoConfig.indexes)
      }

      const client = new MongoClient(connectionUri, options)

      return client.connect().then(() => {
        instance.db = client.db(dbName)
        logger.info(`Mongodb connection to ${connectionUri} established successfully!`)

        resolve(instance)

        // Create indexes in the background
        const bucket: any = []
        for (let index in indexes) {
          if (indexes[index] === 1 || indexes[index] === -1) {
            bucket.push(createIndexes(collectionName, index, indexes[index]))
          }
        }

        Promise.all(bucket)
          .then(() => {
            logger.info(`Indexes created successfully in ${collectionName}`)    
          })
          .catch((error) => {
            logger.error(`Failed while creating indexes in ${collectionName}`)
            logger.error(error)
          })
      }).catch(reject)
    } catch (error) {
      return reject(error)
    }
  })
}

const createIndexes = (collectionId, index, type) => {
  return instance.db.collection(collectionId)
    .createIndex({
      [index]: type
    })
    .then((result) => {
      debug(`Indexes result for ${index}: ${JSON.stringify(result)}`)
      logger.info(`Index created in collection: ${collectionId}, index-field: ${index}, index-type: ${type}`)
      return
    })
}
