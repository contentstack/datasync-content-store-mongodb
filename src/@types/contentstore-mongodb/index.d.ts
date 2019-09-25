/*!
* contentstack-sync-asset-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
declare module 'contentstore-mongodb' {
	
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
	export  const sanitizeConfig: (config: IConfig) => IConfig;

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
	export class Mongodb {
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
	export const setAssetConnector: (instance: IAssetConnector) => void;
	export const setConfig: (config: IConfig) => void;
	export const getConfig: () => IConfig;
	export const getMongoClient: () => Mongodb;
	export const start: (connector: IAssetConnector, config?: IConfig) => Promise<unknown>;


}