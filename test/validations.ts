import { cloneDeep, merge } from 'lodash'
import { config as appConfig } from '../src/defaults'
import { validateAssetConnectorInstance, validateConfig, validateMongodbConfig } from '../src/util/validations'
import { connector } from './mock/assetStore'
import { config as mockConfig } from './mock/config'

const config = cloneDeep(merge({}, appConfig, mockConfig))

describe('validations', () => {
  test('validate app config should throw connector options error', () => {
    const localConfig = cloneDeep(config)
    localConfig.contentStore.options = ({} as any)
    expect(() => {validateConfig(localConfig)}).toThrow('Content connector options cannot be empty!')
  })

  test('validate app config should throw connector uri error', () => {
    const localConfig = cloneDeep(config)
    localConfig.contentStore.uri = ''
    expect(() => {validateConfig(localConfig)}).toThrow('Content connector uri should be of type string and not empty!')
  })

  test('validate asset connector with errors', () => {
    const assetConnector = cloneDeep(connector)
    assetConnector.delete = ({} as any)
    expect(() => {
      validateAssetConnectorInstance(assetConnector)
    }).toThrow(`${JSON.stringify(assetConnector)} connector does not have delete`)
  })

  test('validate mongodb config with uri error', () => {
    const localConfig = cloneDeep(config.contentStore)
    localConfig.uri = ''
    expect(() => {
      validateMongodbConfig(localConfig)
    }).toThrow("Mongodb config 'uri' should be of type string and not empty!")
  })

  test('validate mongodb config with db name error', () => {
    const localConfig = cloneDeep(config.contentStore)
    localConfig.dbName = 'dbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
    expect(() => {
      validateMongodbConfig(localConfig)
    }).toThrow("Mongodb config 'dbName' should be of type string and have length between '1-64'")
  })

  test('validate mongodb config with empty options error', () => {
    const localConfig = cloneDeep(config.contentStore)
    localConfig.options = ({} as any)
    expect(() => {
      validateMongodbConfig(localConfig)
    }).toThrow("Mongodb config 'option' should be of type object and not empty!")
  })
})
