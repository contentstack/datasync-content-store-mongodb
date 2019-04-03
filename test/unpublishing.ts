/**
 * @description Tests mongodb unpublishing method
 */

import { cloneDeep, merge } from 'lodash'
import { setLogger, setConfig } from '../src'
import { connect } from '../src/connection'
import { config as appConfig } from '../src/defaults'
import { Mongodb } from '../src/mongodb'
import { connector } from './mock/assetStore'
import { config as mockConfig } from './mock/config'
import { data as assets } from './mock/data/assets'
import { data as entries } from './mock/data/entries'

const config = cloneDeep(merge({}, appConfig, mockConfig))
config.contentStore.collectionName = 'unpublishing'

let mongoClient
let db, mongo

describe('unpublish', () => {
  beforeAll(() => {
    setLogger()
    setConfig(config)

    return connect(config).then((mongodb) => {
      mongo = mongodb
      mongoClient = new Mongodb(mongodb, connector)
      db = mongoClient
    }).catch(console.error)
  })

  afterAll(() => {
    return mongoClient.db
      .collection(config.contentStore.collectionName)
      .drop()
  })

  afterAll(() => {
    mongo.client.close()
  })

  describe('unpublish an entry', () => {
    test('unpublish an entry successfully', () => {
      const entry = cloneDeep(entries[0])

      return db.publish(entry).then((result) => {
        expect(result).toEqual(entry)

        return db.unpublish(entry).then((result2) => {
          expect(result2).toEqual(entry)
          mongoClient.db.collection(config.contentStore.collectionName).findOne({
            uid: entry.uid,
          }).then((data) => {
            expect(data).toBeNull()
          })
        })
      }).catch(console.error)
    })
  })

  describe('unpublish an asset', () => {
    test('unpublish asset successfully', () => {
      const asset = cloneDeep(assets[0])

      return db.publish(asset).then((result) => {
        expect(result).toEqual(asset)

        return db.unpublish(asset).then((result2) => {
          expect(result2).toEqual(asset)
          mongoClient.db.collection(config.contentStore.collectionName).findOne({
            uid: asset.uid,
          }).then((data) => {
            expect(data).toBeNull()
          })
        })
      }).catch(console.error)
    })
  })

  describe('unpublish should throw an error', () => {
    test('unpublish entry with error', () => {

      return db.unpublish().then((result) => {
        expect(result).toBeUndefined()
      }).catch((error) => {
        expect(error.message).toEqual("Cannot read property 'content_type_uid' of undefined")
      })
    })
  })
})
