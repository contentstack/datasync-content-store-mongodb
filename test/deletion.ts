/**
 * @description Tests mongodb deletion method
 */

import { cloneDeep, merge } from 'lodash'
import { setLogger } from '../src'
import { connect } from '../src/connection'
import { config as appConfig } from '../src/defaults'
import { Mongodb } from '../src/mongodb'
import { connector } from './mock/asset-connector'
import { config as mockConfig } from './mock/config'
import { data as assets } from './mock/data/assets'
import { data as content_type } from './mock/data/content-types'
import { data as entries } from './mock/data/entries'

const config = cloneDeep(merge({}, appConfig, mockConfig))
config['content-connector'].dbName = 'jest-unpublishing'
let db = null
let mongo = null

describe('delete', () => {
  beforeAll(() => {
    setLogger()

    return connect(config).then((mongodb) => {
      mongo = mongodb
      db = new Mongodb(mongodb, connector)
    }).catch(console.error)
  })

  afterAll(() => {
    // mongo.db.dropDatabase().then(mongo.client.close).catch((error) => {
    //   console.error(error)
    //   mongo.client.close()
    // })
  })

  describe('delete an entry', () => {
    test('delete entry successfully', () => {
      const entry = cloneDeep(entries[1])

      return db.publish(entry).then((result) => {
        expect(result).toEqual(entry)

        return db.delete(entry).then((result2) => {
          expect(result2).toEqual(entry)
          mongo.db.collection('contents').findOne({
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
          mongo.db.collection('contents').findOne({
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

        return db.publish(entry2).then((result2) => {
          expect(result2).toEqual(entry2)

          return db.publish(entry3).then((result3) => {
            expect(result3).toEqual(entry3)

            return db.delete(contentType).then((result4) => {
              expect(result4).toEqual(contentType)
              mongo.db.collection('contents').findOne({
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
              }).then((data1) => {
                expect(data1).toEqual(null)
                mongo.db.collection('contents').findOne({
                  uid: contentType.uid,
                }).then((data2) => {
                  expect(data2).toBeNull()
                }).catch(console.error)
              }).catch(console.error)
            }).catch(console.error)
          }).catch(console.error)
        }).catch(console.error)
      }).catch(console.error)
    })
  })

  describe('delete should throw an error', () => {
    test('delete entry with error', () => {

      return db.delete().then((result) => {
        expect(result).toBeUndefined()
      }).catch((error) => {
        expect(error.message).toEqual("Cannot read property 'content_type_uid' of undefined")
      })
    })
  })
})
