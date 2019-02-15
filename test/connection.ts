/**
 * @description Tests mongodb connect method
 */

import { cloneDeep, merge } from 'lodash'
import { setLogger } from '../src'
import { connect } from '../src/connection'
import { config as appConfig } from '../src/defaults'
import { config as mockConfig } from './mock/config'

const config = cloneDeep(merge({}, appConfig, mockConfig))
let mongo = null
describe.only('mongodb connection', () => {
  beforeAll(() => {
    setLogger()
  })
  afterAll(() => {
    mongo.client.close()
  })
  test('connect to mongodb successfully', () => {
    return connect(config).then((mongoClient) => {
      mongo = mongoClient
      expect(mongoClient).toHaveProperty('client')
      expect(mongoClient).toHaveProperty('db')
    }).catch((error) => {
      expect(error).toBeNull()
    })
  })

  test('connect to mongodb 2nd time', () => {
    return connect(config).then((mongoClient) => {
      expect(mongoClient).toHaveProperty('client')
      expect(mongoClient).toHaveProperty('db')
    }).catch((error) => {
      expect(error).toBeNull()
    })
  })
})
