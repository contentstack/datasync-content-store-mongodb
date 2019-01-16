/*!
<<<<<<< HEAD
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
=======
<<<<<<< HEAD
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
=======
* Contentstack Mongodb Content Store
* Copyright © 2019 Contentstack LLC
>>>>>>> ee31b51fa72be4b95d012630091a2b7b449001e0
>>>>>>> develop
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

/**
 * @description Set asset connector instance, that has all the basic methods expected for an asset connector
 * @param {Class | Object} instance - Asset connector instance
 */
export const setAssetConnector = (instance) => {
  debug('Asset connector instance registered successfully')
  assetConnectorInstance = instance
}

/**
 * @description Set app config
 * @param {Object} config - Application config
 */
export const setConfig = (config) => {
  appConfig = config
}

/**
 * @description Set custom logger for logging
 * @param {Object} instance - Custom logger instance
 */
export { setLogger } from './util/logger'

/**
 * @description Get app config
 * @returns an instance of app config
 */
export const getConfig = () => {

  return appConfig
}

/**
 * @description Mongo client instance
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
export const start = (connector, config?, logger?) => {

  return new Promise((resolve, reject) => {
    try {
      appConfig = merge(internalConfig, appConfig, config)
      validateConfig(appConfig)
      assetConnectorInstance = connector || assetConnectorInstance
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
