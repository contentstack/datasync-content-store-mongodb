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
    publish(data: any): Promise<{}>;
    publishAsset(data: any): Promise<{}>;
    publishEntry(data: any): Promise<{}>;
    unpublish(data: any): Promise<{}>;
    delete(data: any): Promise<{}>;
    private unpublishEntry;
    private deleteEntry;
    private unpublishAsset;
    private deleteAsset;
    private deleteContentType;
}
