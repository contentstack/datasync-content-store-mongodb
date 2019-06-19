/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
interface IRequiredKeys {
    _content_type_uid: string;
    locale: string;
    uid: string;
}
export declare const validateConfig: (config: any) => void;
export declare const validateAssetConnectorInstance: (instance: any) => void;
export declare const validateMongodbConfig: (config?: any) => void;
export declare const validateAssetPublish: (asset: IRequiredKeys) => void;
export declare const validateEntryPublish: (entry: IRequiredKeys) => void;
export declare const validateEntryRemove: (entry: IRequiredKeys) => void;
export declare const validateAssetUnpublish: (asset: IRequiredKeys) => void;
export declare const validateAssetDelete: (asset: IRequiredKeys) => void;
export declare const validateContentTypeDelete: (contentType: any) => void;
export declare const validateContentTypeUpdate: (contentType: any) => void;
export {};
