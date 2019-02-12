/**
 * @description Tests mongodb publishing method
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
config.contentStore.dbName = 'jest-publishing'
let db = null

describe('publish', () => {
  beforeAll(() => {
    setLogger()
    setConfig(config)

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
        // expect(result).toHaveProperty('content_type_uid')
        // expect(result).toHaveProperty('title')
        // expect(result).toHaveProperty('uid')
        // expect(result).toHaveProperty('locale')
        // expect(result).toHaveProperty('published_at')
        // expect(result).toHaveProperty('sys_keys')
        // expect(result.sys_keys).toHaveProperty('content_type_uid')
        // expect(result.sys_keys).toHaveProperty('locale')
        // expect(result.sys_keys).toHaveProperty('uid')
        expect(result).toEqual(entry)
      }).catch(console.error)
    })
  })

  describe('publish asset', () => {
    test('publish asset successfully', () => {
      const asset = cloneDeep(assets[0])

      return db.publish(asset).then((result) => {
        expect(result).toHaveProperty('content_type_uid')
        // expect(result.content_type_uid).toHaveProperty('_assets')
        
        // expect(result).toHaveProperty('title')
        // expect(result).toHaveProperty('uid')
        // expect(result).toHaveProperty('locale')
        // expect(result).toHaveProperty('published_at')
        // expect(result).toHaveProperty('sys_keys')
        // expect(result.sys_keys).toHaveProperty('content_type_uid')
        // expect(result.sys_keys).toHaveProperty('locale')
        // expect(result.sys_keys).toHaveProperty('uid')
        expect(result).toEqual(asset)
      }).catch(console.error)
    })
  })

  describe('publish should throw an error', () => {
    test('publish entry successfully', () => {
      // const asset = cloneDeep(entries[0])

      return db.publish().catch((error) => {
        expect(error.message).toEqual('Cannot read property \'content_type_uid\' of undefined')
      })
    })
  })
})
