/*!
 * Contentstack Mongodb Content Connector
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */
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
export declare class Mongodb {
    readonly assetStore: any;
    readonly db: any;
    readonly client: any;
    readonly config: IMongoConfig;
    constructor(mongodb: any, assetStore: any, config: IMongoConfig);
    publish(data: any): Promise<any>;
    publishAsset(data: any): Promise<unknown>;
    updateContentType(contentType: any): Promise<unknown>;
    publishEntry(entry: any): Promise<unknown>;
    unpublish(data: any): Promise<any>;
    delete(data: any): Promise<unknown>;
    private unpublishEntry;
    private deleteEntry;
    private unpublishAsset;
    private deleteAsset;
    private deleteContentType;
    private deleteCT;
}
export {};
