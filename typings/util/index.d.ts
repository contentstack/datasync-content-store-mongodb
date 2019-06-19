/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
interface IContentStore {
    collectionName?: string;
    collection?: {
        entry: string;
        asset: string;
        schema: string;
    };
}
interface IConfig {
    contentStore: IContentStore;
    [propName: string]: any;
}
export declare const sanitizeConfig: (config: IConfig) => IConfig;
export declare const filterAssetKeys: (asset: any) => any;
export declare const filterEntryKeys: (entry: any) => any;
export declare const filterContentTypeKeys: (contentType: any) => any;
export declare const getCollectionName: ({ locale, _content_type_uid }: {
    locale: any;
    _content_type_uid: any;
}) => string;
export declare const getLocalesFromCollections: (collections: {
    name: string;
    type: string;
}[]) => {
    name: string;
    locale: string;
}[];
export {};
