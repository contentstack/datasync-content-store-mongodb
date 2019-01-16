/*!
* Contentstack Mongodb Content Connector declaration file
*/

import { Db } from 'mongodb'

/**
 * @summary Asset connector instance interface
 */
interface IAssetConnector {
  download(): any,
  unpublish(): any,
  delete(): any,
}

/**
 * @summary Content connector instance interface
 */
interface IContentConnector {
  publish(): any,
  unpublish(): any,
  delete(): any,
}

/**
 * @summary Connector interface
 */
interface IConnector {
  start(): Promise<IAssetConnector | IContentConnector>,
  setLogger(): ILogger
}

/**
 * @summary Application config interface
 */
interface IConfig {
  locales?: any[],
  contentstack?: any,
  'content-connector'?: any,
  'sync-manager'?: any,
  'asset-connector'?: any,
}

/**
 * @summary Logger instance interface
 */
interface ILogger {
  warn(): any,
  info(): any,
  log(): any,
  error(): any,
}

/**
 * @summary Content connector instance interface
 */
interface DB extends IContentConnector {}

/**
 * @summary Current connector instance interface
 */
interface IMongoConnector {
  client: any,
  db: DB,
}

/**
 * @summary Set asset connector instance, that has all the basic methods expected for an asset connector
 * @param {Class | Object} instance - Asset connector instance
 */
export declare const setAssetConnector: (instance: IAssetConnector) => void

/**
 * @summary Set app config
 * @param {Object} config - Application config
 */
export declare const setConfig: (config: IConfig) => void

/**
 * @summary Call this to set custom logger, else console will be used
 * @param {Object} instance - Custom logger instance
 */
export { setLogger } from './util/logger'

/**
 * @summary Get app config
 * @returns an instance of app config
 */
export declare const getConfig: () => IConfig

/**
 * @summary Mongo client instance
 * @returns Mongodb connection instance
 */
export declare let mongoClient: IMongoConnector

/**
 * @summary
 * Entry point of the app
 * @description
 * Sets asset connectors, validates them and starts the app
 * @param {Class | Object} connector - Asset connector instance
 * @param {Object} config - Set application config
 * @param {Class | Object} logger - Logger object
 */
export declare const start: (connector: IAssetConnector, config?: IConfig, logger?: ILogger) => Promise<IMongoConnector>
