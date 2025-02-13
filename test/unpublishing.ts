/**
 * @description Tests mongodb unpublishing method
 */

import { cloneDeep, merge } from 'lodash'
import { setConfig } from '../src'
import { config as appConfig } from '../src/config'
import { connect } from '../src/connection'
import { Mongodb } from '../src/mongodb'
import { connector } from './mock/assetStore'
import { config as mockConfig } from './mock/config'
import { data as assets } from './mock/data/assets'
import { data as entries } from './mock/data/entries'

const config = cloneDeep(merge({}, appConfig, mockConfig))
config.contentStore.collectionName = 'unpublishing'

let mongoClient
// tslint:disable-next-line: one-variable-per-declaration
let db, mongo

describe('unpublish', () => {
  beforeAll(() => {
    setConfig(config)

    return connect(config).then((mongodb) => {
      mongo = mongodb
      mongoClient = new Mongodb(mongodb, connector, config.contentStore, config)
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
      }).catch((error) => {
        expect(error).toBeNull()
      })
    })
  })

  describe('unpublish an asset', () => {
    test('unpublish asset successfully', () => {
      const asset = cloneDeep(assets[0])

      return db.publish(asset).then((result) => {
        expect(result).toEqual(asset)

        return db.unpublish(asset).then((result2) => {
          // expect(result2).not.toBeNull()
          // expect(result2._version).toEqual(1)
          // expect(result2.content_type_uid).toEqual('_assets')
          // // Important checks
          // expect(result2.locale).toEqual(asset.locale)
          // expect(result2.uid).toEqual(asset.uid)
          // expect(result2.title).toEqual(asset.data.title)
          expect(result2).toEqual(asset)
          mongoClient.db.collection(config.contentStore.collectionName).findOne({
            uid: asset.uid,
          }).then((data) => {
            expect(data).toBeNull()
          })
        })
      }).catch((error) => {
        expect(error).toBeNull()
      })
    })
  })

  describe('unpublish should throw an error', () => {
    test('unpublish entry with error', () => {

      return db.unpublish().then((result) => {
        expect(result).toBeUndefined()
      }).catch((error) => {
        expect(error.message).toEqual("Cannot read properties of undefined (reading \'_content_type_uid\')")
      })
    })
  })
})
