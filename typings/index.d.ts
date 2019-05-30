/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
interface IConnector {
    publish(): any;
    unpublish(): any;
    delete(): any;
}
interface IAssetConnector {
    start(): IConnector;
    setLogger(): ILogger;
}
interface IConfig {
    locales?: any[];
    contentstack?: any;
    unwantedKeys?: any;
    contentStore?: any;
    syncManager?: any;
    assetStore?: any;
}
interface ILogger {
    warn(): any;
    info(): any;
    log(): any;
    error(): any;
}
export declare const setAssetConnector: (instance: IAssetConnector) => void;
export declare const setConfig: (config: IConfig) => void;
export { setLogger } from './util/logger';
export declare const getConfig: () => IConfig;
export declare let mongoClient: any;
export declare const start: (connector: IAssetConnector, config?: IConfig, logger?: ILogger) => Promise<unknown>;
