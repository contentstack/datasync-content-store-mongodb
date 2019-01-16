/**
 * @description Tests mongodb unpublishing method
 */

import { cloneDeep, merge } from 'lodash'
import { setLogger } from '../src'
import { connect } from '../src/connection'
import { config as appConfig } from '../src/defaults'
import { Mongodb } from '../src/mongodb'
import { connector } from './mock/asset-connector'
import { config as mockConfig } from './mock/config'
import { data as assets } from './mock/data/assets'
import { data as entries } from './mock/data/entries'

const config = cloneDeep(merge({}, appConfig, mockConfig))
config['content-connector'].dbName = 'jest-unpublishing'
let db = null
let mongo = null

describe('unpublish', () => {
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

  describe('unpublish an entry', () => {
    test('unpublish an entry successfully', () => {
      const entry = cloneDeep(entries[0])

      return db.publish(entry).then((result) => {
        expect(result).toEqual(entry)

        return db.unpublish(entry).then((result2) => {
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

  describe('unpublish an asset', () => {
    test('unpublish asset successfully', () => {
      const asset = cloneDeep(assets[0])

      return db.publish(asset).then((result) => {
        expect(result).toEqual(asset)

        return db.unpublish(asset).then((result2) => {
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
