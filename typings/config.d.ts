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
        indexes: {
            published_at: number;
            _content_type_uid: number;
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
            useNewUrlParser: boolean;
        };
        unwantedKeys: {
            asset: {
                action: boolean;
                checkpoint: boolean;
                'data.created_by': boolean;
                event_at: boolean;
                type: boolean;
                'data.updated_by': boolean;
            };
            contentType: {
                'data.created_by': boolean;
                'data.updated_by': boolean;
                'data.DEFAULT_ACL': boolean;
                'data.SYS_ACL': boolean;
                'data.abilities': boolean;
                'data.last_activity': boolean;
            };
            entry: {
                action: boolean;
                checkpoint: boolean;
                'data.created_by': boolean;
                event_at: boolean;
                type: boolean;
                'data.updated_by': boolean;
            };
        };
        uri: string;
    };
};
