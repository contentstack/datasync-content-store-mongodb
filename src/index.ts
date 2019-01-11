import Debug from 'debug'
import { merge } from 'lodash'
import { connect } from './connection'
import { config as internalConfig } from './defaults'
import { Mongodb } from './mongodb'
import { setLogger } from './util/logger'

import {
  validateAssetConnectorInstance,
  validateConfig,
} from './util/validations'

const debug = Debug('registration')

let appConfig: any = {}
let assetConnectorInstance

export const setAssetConnector = (instance) => {
  debug('Asset connector instance registered successfully')
  // do something with connector instance
  assetConnectorInstance = instance
}

export const setConfig = (config) => {
  validateConfig(config)
  debug('Config set successfully!')
  appConfig = config
}

/**
 * @description Set custom logger for logging
 * @param {Object} instance - Custom logger instance
 */
export const setCustomLogger = (logger?) => {
  setLogger(logger)
}

export const getConfig = () => {

  return appConfig
}

export let mongoClient

export const start = (config, connector, logger?) => {

  return new Promise((resolve, reject) => {
    try {
      appConfig = merge(internalConfig, appConfig, config)
      validateConfig(appConfig)
      assetConnectorInstance = assetConnectorInstance || connector
      validateAssetConnectorInstance(assetConnectorInstance)
      setLogger(logger)

      return connect(appConfig).then((mongo) => {
        mongoClient = new Mongodb(mongo, assetConnectorInstance)

        return resolve(mongoClient)
      }).catch(reject)
    } catch (error) {
      return reject(error)
    }
  })
}
