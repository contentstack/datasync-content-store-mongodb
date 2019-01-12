/*!
* Contentstack Mongodb Content Store
* Copyright © 2019 Contentstack LLC
* MIT Licensed
*/
export declare const setAssetConnector: (instance: any) => void;
export declare const setConfig: (config: any) => void;
export declare const setCustomLogger: (logger?: any) => void;
export declare const getConfig: () => any;
export declare let mongoClient: any;
export declare const start: (config: any, connector?: any, logger?: any) => Promise<{}>;
