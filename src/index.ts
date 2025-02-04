/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import Debug from 'debug'
import { merge } from 'lodash'
import { config as internalConfig } from './config'
import { connect } from './connection'
import { Mongodb } from './mongodb'
import { sanitizeConfig } from './util/index'

import {
  validateAssetConnectorInstance,
  validateConfig,
} from './util/validations'

const debug = Debug('registration')

let appConfig: any = {}
let assetConnectorInstance: IAssetConnector
let mongoClient: Mongodb

interface IConnector {
  publish<T>(input: T): Promise<{T: any}>,
  unpublish<T>(input: T): Promise<{T: any}>,
  delete<T>(input: T): Promise<{T: any}>,
}

interface IAssetConnector {
  start(): IConnector,
}

interface IMongoConfig {
  dbName?: string,
  collection?: {
    entry?: string,
    asset?: string,
    schema?: string,
  },
  collectionName?: string,
  indexes?: any,
  [propName: string]: any
}

interface IConfig {
  contentStore: IMongoConfig,
  assetStore: any, // We do not know what config asset store needs/would have
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
export const getMongoClient = () => {
  return mongoClient
}

/**
 * @summary
 * Entry point of the app
 * @description
 * Sets asset connectors, validates them and starts the app
 * @param {Class | Object} connector - Asset connector instance
 * @param {Object} config - Set application config
 */
export const start = (connector: IAssetConnector, config?: IConfig) => {

  return new Promise((resolve, reject) => {
    try {
      appConfig = merge(internalConfig, appConfig, config)
      validateConfig(appConfig)
      appConfig = sanitizeConfig(appConfig)
      assetConnectorInstance = connector || assetConnectorInstance
      validateAssetConnectorInstance(assetConnectorInstance)

      return connect(appConfig)
        .then((mongo) => {
          mongoClient = new Mongodb(mongo, assetConnectorInstance, appConfig.contentStore, appConfig)
          debug('Mongo connector instance created successfully!')

          return resolve(mongoClient)
        })
        .catch(reject)
    } catch (error) {
      return reject(error)
    }
  })
}
