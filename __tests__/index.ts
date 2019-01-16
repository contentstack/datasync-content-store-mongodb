/**
 * @description Test contentstack-mongodb-content-store module export methods
 */

import { getConfig, setAssetConnector, setConfig, setCustomLogger, start, mongoClient } from '../src'
import { connector } from './mock/asset-connector'
import { config as mockConfig } from './mock/config'

describe('core', () => {
  test('set and get config without any errors', () => {
    expect(setConfig(mockConfig)).toBeUndefined()
    expect(getConfig()).toEqual(mockConfig)
  })

  test('set asset connector without issues', () => {
    expect(setAssetConnector(connector)).toBeUndefined()
  })

  test('set custom logger', () => {
    expect(setCustomLogger()).toBeUndefined()
  })

  test('start mongo driver without successfully', () => {
    setAssetConnector(connector)    

    return start(mockConfig).then((mongo) => {
      expect(mongo).toHaveProperty('db')
      expect(mongo).toHaveProperty('client')
      expect(mongo).toEqual(mongoClient)
    }).catch((error) => {
      expect(error).toBeNull()
    })
  })
})
