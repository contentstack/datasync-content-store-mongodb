/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
import { Mongodb } from './mongodb';
interface IConnector {
    publish<T>(input: T): Promise<{
        T: any;
    }>;
    unpublish<T>(input: T): Promise<{
        T: any;
    }>;
    delete<T>(input: T): Promise<{
        T: any;
    }>;
}
interface IAssetConnector {
    start(): IConnector;
}
interface IMongoConfig {
    dbName?: string;
    collection?: {
        entry?: string;
        asset?: string;
        schema?: string;
    };
    collectionName?: string;
    indexes?: any;
    [propName: string]: any;
}
interface IConfig {
    contentStore: IMongoConfig;
    assetStore: any;
}
export declare const setAssetConnector: (instance: IAssetConnector) => void;
export declare const setConfig: (config: IConfig) => void;
export declare const getConfig: () => IConfig;
export declare const getMongoClient: () => Mongodb;
export declare const start: (connector: IAssetConnector, config?: IConfig) => Promise<{}>;
export {};
