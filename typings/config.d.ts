/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
export declare const config: {
    contentStore: {
        dbName: string;
        collection: {
            entry: string;
            asset: string;
            schema: string;
        };
        options: {
            autoReconnect: boolean;
            connectTimeoutMS: number;
            keepAlive: boolean;
            noDelay: boolean;
            reconnectInterval: number;
            reconnectTries: number;
            useNewUrlParser: boolean;
        };
        unwantedKeys: {
            asset: {
                type: boolean;
                _checkpoint: boolean;
                _workflow: boolean;
                created_by: boolean;
                _event_at: boolean;
                updated_by: boolean;
                publish_details: boolean;
            };
            contentType: {
                created_by: boolean;
                updated_by: boolean;
                DEFAULT_ACL: boolean;
                SYS_ACL: boolean;
                abilities: boolean;
                last_activity: boolean;
                _workflow: boolean;
            };
            entry: {
                type: boolean;
                _checkpoint: boolean;
                _workflow: boolean;
                created_by: boolean;
                _event_at: boolean;
                updated_by: boolean;
                publish_details: boolean;
            };
        };
        uri: string;
    };
};
