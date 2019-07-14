/**
 * @description Tests mongodb deletion method
 */

import { cloneDeep, merge } from 'lodash'
import { setConfig } from '../src'
import { config as appConfig } from '../src/config'
import { connect } from '../src/connection'
import { Mongodb } from '../src/mongodb'
import { connector } from './mock/assetStore'
import { config as mockConfig } from './mock/config'
import { data as assets } from './mock/data/assets'
import { data as content_type } from './mock/data/content-types'
import { data as entries } from './mock/data/entries'

const config = cloneDeep(merge({}, appConfig, mockConfig))
config.contentStore.collectionName = 'deletion'

let mongoClient
// tslint:disable-next-line: one-variable-per-declaration
let db, mongo

describe('delete', () => {
  beforeAll(() => {
    setConfig(config)

    return connect(config).then((mongodb) => {
      mongo = mongodb
      mongoClient = new Mongodb(mongodb, connector, config.contentStore)
      db = mongoClient
    })
    .catch(console.error)
  })

  afterAll(() => {
    return mongoClient.db
      .collection(config.contentStore.collectionName)
      .drop()
  })

  afterAll(() => {
    mongo.client.close()
  })

  describe('delete an entry', () => {
    test('delete entry successfully', () => {
      const entry = cloneDeep(entries[1])

      return db.publish(entry).then((result) => {
        expect(result).toEqual(entry)

        return db.delete(entry).then((result2) => {
          expect(result2).toEqual(entry)
          mongoClient.db.collection('contents').findOne({
            uid: entry.uid,
          }).then((data) => {
            expect(data).toBeNull()
          }).catch(console.error)
        })
      }).catch(console.error)
    })
  })

  describe('delete an asset', () => {
    test('delete asset successfully', () => {
      const asset = cloneDeep(assets[0])

      return db.publish(asset).then((result) => {
        expect(result).toEqual(asset)

        return db.delete(asset).then((result2) => {
          expect(result2).toEqual(asset)
          mongoClient.db.collection('contents').findOne({
            uid: asset.uid,
          }).then((data) => {
            expect(data).toBeNull()
          }).catch(console.error)
        })
      }).catch(console.error)
    })
    test('delete asset that does not exist', () => {
      const asset = cloneDeep(assets[0])

      return db.publish(asset).then((result) => {
        expect(result).toEqual(asset)
        asset.uid = 'does not exist'

        return db.delete(asset).then((result2) => {
          expect(result2).toEqual(asset)
          mongoClient.db.collection('contents').findOne({
            uid: asset.uid,
          }).then((data) => {
            expect(data).toBeNull()
          }).catch(console.error)
        })
      }).catch(console.error)
    })
  })

  describe('delete a content type', () => {
    test('delete content type successfully', () => {
      const entry1 = cloneDeep(entries[0])
      const entry2 = cloneDeep(entries[1])
      const entry3 = cloneDeep(entries[2])
      const contentType = cloneDeep(content_type[0])

      return db.publish(entry1).then((result1) => {
        expect(result1).toEqual(entry1)

        return db.publish(entry2)
      })
      .then((result2) => {
        expect(result2).toEqual(entry2)

        return db.publish(entry3)
      })
      .then((result3) => {
        expect(result3).toEqual(entry3)

        return db.delete(contentType)
      })
      .then((result4) => {
        expect(result4).toEqual(contentType)

        return mongoClient.db.collection('contents').findOne({
          $or: [
            {
              uid: entry1.uid,
            },
            {
              uid: entry2.uid,
            },
            {
              uid: entry3.uid,
            },
          ],
        })
      })
      .then((data1) => {
        expect(data1).toEqual(null)

        return mongoClient.db.collection('contents').findOne({
          uid: contentType.uid,
        })
      })
      .then((data2) => {
        expect(data2).toBeNull()
      })
      .catch(console.error)
    })
  })

  describe('delete should throw an error', () => {
    test('delete entry with error', () => {

      return db.delete().catch((error) => {
        expect(error.message).toEqual("Cannot read property '_content_type_uid' of undefined")
      })
    })
  })
})
