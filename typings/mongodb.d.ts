/*!
<<<<<<< HEAD
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
=======
* Contentstack Mongodb Content Store
* Copyright © 2019 Contentstack LLC
>>>>>>> origin/develop
* MIT Licensed
*/
export declare class Mongodb {
    assetConnector: any;
    db: any;
    client: any;
    private collectionName;
    constructor(mongodb: any, connector: any);
    publish(data: any): Promise<{}>;
    publishAsset(data: any): Promise<{}>;
    publishEntry(data: any): Promise<{}>;
    unpublish(data: any): Promise<{}>;
    delete(data: any): Promise<{}>;
    find(data: any): Promise<{}>;
    findOne(data: any): Promise<{}>;
    private unpublishEntry;
    private deleteEntry;
    private unpublishAsset;
    private deleteAsset;
    private deleteContentType;
}
