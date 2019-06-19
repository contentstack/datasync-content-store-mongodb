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
    publish(data: any): Promise<{}>;
    publishAsset(data: any): Promise<{}>;
    updateContentType(contentType: any): Promise<{}>;
    publishEntry(entry: any): Promise<{}>;
    unpublish(data: any): Promise<{}>;
    delete(data: any): Promise<{}>;
    private unpublishEntry;
    private deleteEntry;
    private unpublishAsset;
    private deleteAsset;
    private deleteContentType;
    private deleteCT;
}
export {};
