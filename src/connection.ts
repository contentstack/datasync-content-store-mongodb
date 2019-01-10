import { MongoClient } from 'mongodb'
import { logger } from './util/logger'
import { map as promiseMap } from './util/promise.map'
import { validateMongodbConfig } from './util/validations'

const indexes = {
  content_type_uid: 1,
  locales: 1,
  uid: 1,
}
const collections = ['entries', 'assets', 'content_types']
let db = null

export const connect = (config) => {
  return new Promise((resolve, reject) => {
    try {
      if (!db) {
        const mongoConfig = config['content-connector']
        validateMongodbConfig(mongoConfig)
        const connectionUri = mongoConfig.uri
        const dbName = mongoConfig.dbName
        const options = mongoConfig.options
        const client = new MongoClient(connectionUri, options)

        return client.connect().then(() => {
          db = client.db(dbName)

          return promiseMap(collections, (collection) => {
            return new Promise((mapResolve, mapReject) => {
              return db.collection(collection).createIndex(indexes)
                .then(mapResolve)
                .catch(mapReject)
            })
          }, 2).then(() => {
            logger.info(`Mongodb connection to ${connectionUri} established successfully!`)

            return resolve({
              client,
              db,
            })
          })
        }).catch(reject)
      }

      return resolve(db)
    } catch (error) {
      reject(error)
    }
  })
}
