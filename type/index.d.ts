/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
declare module "mongoDbContentStoreModule" {
	
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
	export declare const start: (connector: IAssetConnector, config?: IConfig) => Promise<unknown>;


}