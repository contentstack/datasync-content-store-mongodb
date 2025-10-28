/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

/**
 * Type definitions for centralized messages
 */

export interface IMessages {
  CONNECTION: {
    URL: string;
    DB_NAME: string;
    COLLECTION_NAMES: string;
    DB_OPTIONS: string;
    SUCCESS: (connectionUri: string) => string;
  };
  CONNECTOR: {
    INSTANCE_CREATED: string;
  };
  ASSET: {
    PUBLISH_INITIATED: (data: any) => string;
    PUBLISH_RESULT: (result: any) => string;
    UNPUBLISH_INITIATED: (asset: any) => string;
    UNPUBLISH_RESULT: (result: any) => string;
    DELETE_INITIATED: (asset: any) => string;
    DOES_NOT_EXIST: string;
    ONLY_PUBLISHED_PRESENT: (asset: any) => string;
    EXISTED_IN_MULTIPLE_FORMS: string;
  };
  ENTRY: {
    PUBLISH_INITIATED: (entry: any) => string;
    PUBLISH_RESULT: (result: any) => string;
    DELETE_INITIATED: (entry: any) => string;
    DELETE_RESULT: (result: any) => string;
  };
  CONTENT_TYPE: {
    UPDATE_RESULT: (result: any) => string;
    DELETE_INITIATED: (contentType: any) => string;
    DELETE_RESULT: (result: any) => string;
    DELETE_ENTRIES_RESULT: (result: any) => string;
  };
  PROCESS: {
    SHUTDOWN: (signal: string, killDuration: number) => string;
    UNHANDLED_ERROR: string;
  };
  LOGGER: {
    MESSAGE_MISSING: string;
  };
}

export declare const MESSAGES: IMessages;

