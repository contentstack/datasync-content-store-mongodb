/**
 * @description Test contentstack-mongodb-content-store module export methods
 */

import { getConfig, mongoClient, setAssetConnector, setConfig, setLogger, start } from '../src'
import { assetConnector, connector } from './mock/assetStore'
import { config as mockConfig } from './mock/config'

describe('core', () => {
  test('set and get config without any errors', () => {
    expect(setConfig(mockConfig)).toBeUndefined()
    expect(getConfig()).toEqual(mockConfig)
  })

  test('set asset connector without issues', () => {
    expect(setAssetConnector((assetConnector as any))).toBeUndefined()
  })

  test('set custom logger', () => {
    expect(setLogger()).toEqual(console)
  })

  test('start mongo driver without successfully', () => {
    setAssetConnector((connector as any))

    return start((connector as any), mockConfig).then((mongo) => {
      expect(mongo).toHaveProperty('db')
      expect(mongo).toHaveProperty('client')
      expect(mongo).toEqual(mongoClient)
    }).catch((error) => {
      expect(error).toBeNull()
    })
  })
})
