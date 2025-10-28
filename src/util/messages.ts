/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

/**
 * Centralized messages for logging and error handling
 * This file contains all log messages, error messages, and console outputs
 * used throughout the application for consistency and maintainability.
 */

export const MESSAGES = {
  // Connection messages
  CONNECTION: {
    URL: 'Connection URL',
    DB_NAME: 'Database name',
    COLLECTION_NAMES: 'Collection names',
    DB_OPTIONS: 'Database options',
    SUCCESS: (connectionUri: string) => `MongoDB connection to ${connectionUri} established successfully.`,
  },

  // MongoDB connector messages
  CONNECTOR: {
    INSTANCE_CREATED: 'Mongo connector instance created successfully.',
  },

  // Asset operation messages
  ASSET: {
    PUBLISH_INITIATED: (data: any) => `Asset publish initiated with: ${JSON.stringify(data)}`,
    PUBLISH_RESULT: (result: any) => `Asset publish result: ${JSON.stringify(result)}`,
    UNPUBLISH_INITIATED: (asset: any) => `Asset unpublish initiated for: ${JSON.stringify(asset)}`,
    UNPUBLISH_RESULT: (result: any) => `Asset unpublish result: ${JSON.stringify(result)}`,
    DELETE_INITIATED: (asset: any) => `Asset delete initiated for: ${JSON.stringify(asset)}`,
    DOES_NOT_EXIST: 'Asset does not exist.',
    ONLY_PUBLISHED_PRESENT: (asset: any) => `Only published object of ${JSON.stringify(asset)} was present`,
    EXISTED_IN_MULTIPLE_FORMS: 'Asset existed in pubilshed and RTE/Markdown form. Removed published asset object.',
  },

  // Entry operation messages
  ENTRY: {
    PUBLISH_INITIATED: (entry: any) => `Entry publish initiated with: ${JSON.stringify(entry)}`,
    PUBLISH_RESULT: (result: any) => `Entry publish result: ${JSON.stringify(result)}`,
    DELETE_INITIATED: (entry: any) => `Entry delete initiated for: ${JSON.stringify(entry)}`,
    DELETE_RESULT: (result: any) => `Entry delete result: ${JSON.stringify(result)}`,
  },

  // Content type operation messages
  CONTENT_TYPE: {
    UPDATE_RESULT: (result: any) => `Content type update result ${JSON.stringify(result)}`,
    DELETE_INITIATED: (contentType: any) => `Content type delete initiated for: ${JSON.stringify(contentType)}`,
    DELETE_RESULT: (result: any) => `Content type delete result ${JSON.stringify(result)}`,
    DELETE_ENTRIES_RESULT: (result: any) => `Delete entries result ${JSON.stringify(result)}`,
  },

  // Process management messages
  PROCESS: {
    SHUTDOWN: (signal: string, killDuration: number) => `Received ${signal}. Shutting down the process in ${killDuration} ms.`,
    UNHANDLED_ERROR: 'An unexpected error occurred. Locking the process for 10 seconds to recover.',
  },

  // Logger messages
  LOGGER: {
    MESSAGE_MISSING: 'Message missing or could not be resolved.',
  },
};

export default MESSAGES;

