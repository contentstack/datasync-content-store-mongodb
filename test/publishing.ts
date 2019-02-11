/**
 * @description Tests mongodb publishing method
 */

import { cloneDeep, merge } from 'lodash'
import { setLogger } from '../src'
import { connect } from '../src/connection'
import { config as appConfig } from '../src/defaults'
import { Mongodb } from '../src/mongodb'
import { connector } from './mock/assetStore'
import { config as mockConfig } from './mock/config'
import { data as assets } from './mock/data/assets'
import { data as entries } from './mock/data/entries'

const config = cloneDeep(merge({}, appConfig, mockConfig))
config.contentStore.dbName = 'jest-publishing'
let db = null

describe('publish', () => {
  beforeAll(() => {
    setLogger()

    return connect(config).then((mongodb) => {
      db = new Mongodb(mongodb, connector)
    }).catch(console.error)
  })

  afterAll(() => {
    // mongo.db.dropDatabase().then(mongo.client.close).catch((error) => {
    //   console.error(error)
    //   mongo.client.close()
    // })
  })

  describe('publish entry', () => {
    test('publish entry successfully', () => {
      const entry = cloneDeep(entries[0])

      return db.publish(entry).then((result) => {
        expect(result).toEqual(entry)
      }).catch(console.error)
    })
  })

  describe('publish asset', () => {
    test('publish entry successfully', () => {
      const asset = cloneDeep(assets[0])

      return db.publish(asset).then((result) => {
        expect(result).toEqual(asset)
      }).catch(console.error)
    })
  })

  describe('publish should throw an error', () => {
    test('publish entry successfully', () => {
      const asset = cloneDeep(assets[0])

      return db.publish().then((result) => {
        expect(result).toEqual(asset)
      }).catch((error) => {
        expect(error.message).toEqual("Cannot read property 'content_type_uid' of undefined")
      })
    })
  })
})
