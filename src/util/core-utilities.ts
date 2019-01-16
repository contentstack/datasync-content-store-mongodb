/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

const assetFilterKeys = ['type', 'event_at', 'checkpoint', 'action']
const entryFilterKeys = ['type', 'event_at', 'checkpoint', 'action']
const contentTypeFilterKeys = ['type', 'event_at', 'checkpoint', 'action']

/**
 * @description Remove unwanted keys from asset json
 * @param {Object} asset - Asset json
 */
export const filterAssetKeys = (asset) => {
  assetFilterKeys.forEach((key) => {
    delete asset[key]
  })

  return asset
}

/**
 * @description Remove unwanted keys from entry json
 * @param {Object} entry - Entry json
 */
export const filterEntryKeys = (entry) => {
  entryFilterKeys.forEach((key) => {
    delete entry[key]
  })

  return entry
}

/**
 * @description Remove unwanted keys from content type json
 * @param {Object} contentType - Content type json
 */
export const filterContentTypeKeys = (contentType) => {
  contentTypeFilterKeys.forEach((key) => {
    delete contentType[key]
  })

  return contentType
}
