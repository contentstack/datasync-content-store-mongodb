/*!
* Contentstack Mongodb Content Store
* Copyright © 2019 Contentstack LLC
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
        uri: string;
    };
};
