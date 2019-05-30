/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
export declare class Mongodb {
    assetStore: any;
    db: any;
    client: any;
    private collection;
    constructor(mongodb: any, assetStore: any, config: any);
    publish(data: any): Promise<unknown>;
    publishAsset(data: any): Promise<unknown>;
    publishEntry(data: any): Promise<unknown>;
    unpublish(data: any): Promise<unknown>;
    delete(data: any): Promise<unknown>;
    private unpublishEntry;
    private deleteEntry;
    private unpublishAsset;
    private deleteAsset;
    private deleteContentType;
}
