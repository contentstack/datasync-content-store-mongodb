/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
export declare const config: {
    contentStore: {
        collection: {
            asset: string;
            entry: string;
            schema: string;
        };
        dbName: string;
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
                _checkpoint: boolean;
                _event_at: boolean;
                _type: boolean;
                _workflow: boolean;
                created_by: boolean;
                publish_details: boolean;
                updated_by: boolean;
            };
            contentType: {
                DEFAULT_ACL: boolean;
                SYS_ACL: boolean;
                _workflow: boolean;
                abilities: boolean;
                created_by: boolean;
                last_activity: boolean;
                updated_by: boolean;
            };
            entry: {
                _checkpoint: boolean;
                _event_at: boolean;
                _type: boolean;
                _workflow: boolean;
                created_by: boolean;
                publish_details: boolean;
                updated_by: boolean;
            };
        };
        uri: string;
    };
};
