/*!
<<<<<<< HEAD
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
=======
<<<<<<< HEAD
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
=======
* Contentstack Mongodb Content Store
* Copyright © 2019 Contentstack LLC
>>>>>>> ee31b51fa72be4b95d012630091a2b7b449001e0
>>>>>>> develop
* MIT Licensed
*/
export declare const setAssetConnector: (instance: any) => void;
export declare const setConfig: (config: any) => void;
export { setLogger } from './util/logger';
export declare const getConfig: () => any;
export declare let mongoClient: any;
export declare const start: (connector: any, config?: any, logger?: any) => Promise<{}>;
