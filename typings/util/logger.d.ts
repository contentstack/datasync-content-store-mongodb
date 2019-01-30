/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
interface ILogger {
    warn(): any;
    info(): any;
    log(): any;
    error(): any;
}
export declare const setLogger: (customLogger?: ILogger) => any;
export declare let logger: any;
export {};
