/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

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

interface IConnector {
  publish(): any,
  unpublish(): any,
  delete(): any,
  find(): any[],
  findOne(): any,
}

interface IAssetConnector {
  start(): IConnector,
  setLogger(): ILogger,
}

interface IConfig {
  locales?: any[],
  contentstack?: any,
  unwantedKeys?: any,
  contentStore?: any,
  syncManager?: any,
  assetStore?: any,
}

interface ILogger {
  warn(): any,
  info(): any,
  log(): any,
  error(): any,
}

/**
 * @summary Set asset connector instance, that has all the basic methods expected for an asset connector
 * @param {Class | Object} instance - Asset connector instance
 */
export const setAssetConnector = (instance: IAssetConnector) => {
  assetConnectorInstance = instance
}

/**
 * @summary Set app config
 * @param {Object} config - Application config
 */
export const setConfig = (config: IConfig) => {
  appConfig = config
}

/**
 * @summary Set custom logger for logging
 * @param {Object} instance - Custom logger instance
 */
export { setLogger } from './util/logger'

/**
 * @summary Get app config
 * @returns an instance of app config
 */
export const getConfig = (): IConfig => {

  return appConfig
}

/**
 * @summary Mongo client instance
 * @returns Mongodb connection instance
 */
export let mongoClient

/**
 * @summary
 * Entry point of the app
 * @description
 * Sets asset connectors, validates them and starts the app
 * @param {Class | Object} connector - Asset connector instance
 * @param {Object} config - Set application config
 * @param {Class | Object} logger - Logger object
 */
export const start = (connector: IAssetConnector, config?: IConfig, logger?: ILogger) => {

  return new Promise((resolve, reject) => {
    try {
      appConfig = merge(internalConfig, appConfig, config)
      validateConfig(appConfig)
      assetConnectorInstance = connector || assetConnectorInstance
      validateAssetConnectorInstance(assetConnectorInstance)
      setLogger(logger)

      return connect(appConfig).then((mongo) => {
        mongoClient = new Mongodb(mongo, assetConnectorInstance)
        debug('Mongo connector instance created successfully!')

        return resolve(mongoClient)
      }).catch(reject)
    } catch (error) {
      return reject(error)
    }
  })
}
