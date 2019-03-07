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
config.contentStore.collectionName = 'publishing'

let mongoClient
let db

describe('publish', () => {
  beforeAll(() => {
    setLogger()
    setConfig(config)

    return connect(config).then((mongodb) => {
      mongoClient = new Mongodb(mongodb, connector)
      db = mongoClient
    }).catch(console.error)
  })

  afterAll(() => {
    return mongoClient.db
      .collection(config.contentStore.collectionName)
      .drop()
  })

  describe('publish entry', () => {
    test('publish entry successfully', () => {
      const entry = cloneDeep(entries[0])

      return db.publish(entry).then((result) => {
        expect(result).toMatchObject(entry)
      })
    })
  })

  describe('publish asset', () => {
    test('publish asset successfully', () => {
      const asset = cloneDeep(assets[0])

      return db.publish(asset).then((result) => {
        expect(result).toMatchObject(asset)
      })
    })
  })

  describe('publish should throw an error', () => {
    test('publish entry successfully', () => {
      return db.publish().catch((error) => {
        expect(error.message).toEqual('Cannot read property \'content_type_uid\' of undefined')
      })
    })
  })
})
