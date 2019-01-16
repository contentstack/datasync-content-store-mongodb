/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
export declare const setAssetConnector: (instance: any) => void;
export declare const setConfig: (config: any) => void;
export { setLogger } from './util/logger';
export declare const getConfig: () => any;
export declare let mongoClient: any;
export declare const start: (connector: any, config?: any, logger?: any) => Promise<{}>;
