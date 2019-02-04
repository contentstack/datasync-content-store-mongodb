/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
export declare const config: {
    'content-connector': {
        dbName: string;
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
