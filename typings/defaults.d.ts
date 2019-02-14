/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
export declare const config: {
    contentStore: {
        dbName: string;
        indexes: {
            published_at: number;
            content_type_uid: number;
            locale: number;
            uid: number;
        };
        options: {
            autoReconnect: boolean;
            connectTimeoutMS: number;
            keepAlive: boolean;
            noDelay: boolean;
            reconnectInterval: number;
            reconnectTries: number;
            userNewUrlParser: boolean;
        };
        unwantedKeys: {
            asset: string[];
            contentType: string[];
            entry: string[];
        };
        uri: string;
    };
};
