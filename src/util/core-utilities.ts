/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import { cloneDeep, hasIn } from 'lodash'
import { getConfig } from '..'

const assetFilterKeys = ['type', 'event_at', 'checkpoint', 'action']
const entryFilterKeys = ['type', 'event_at', 'checkpoint', 'action']
const contentTypeFilterKeys = ['type', 'event_at', 'checkpoint', 'action']
const indexedKeys = ['content_type_uid', 'locale', 'uid', 'published_at']

/**
 * @summary Remove unwanted keys from asset json
 * @param {Object} asset - Asset json
 */
export const filterAssetKeys = (asset) => {
  const config = getConfig()
  assetFilterKeys.forEach((key) => {
    delete asset[key]
  })
  const unwantedKeys = config['content-connector'].unwantedKeys
  if (unwantedKeys && unwantedKeys.asset && unwantedKeys.asset.length !== 0) {
    unwantedKeys.asset.forEach((key) => {
      delete asset.data[key]
    })
  }

  return asset
}

/**
 * @summary Remove unwanted keys from entry json
 * @param {Object} entry - Entry json
 */
export const filterEntryKeys = (entry) => {
  const config = getConfig()
  entryFilterKeys.forEach((key) => {
    delete entry[key]
  })
  const unwantedKeys = config['content-connector'].unwantedKeys
  if (unwantedKeys && unwantedKeys.entry && unwantedKeys.entry.length !== 0) {
    unwantedKeys.entry.forEach((key) => {
      delete entry.data[key]
    })
  }

  return entry
}

/**
 * @summary Remove unwanted keys from content type json
 * @param {Object} contentType - Content type json
 */
export const filterContentTypeKeys = (contentType) => {
  const config = getConfig()
  contentTypeFilterKeys.forEach((key) => {
    delete contentType[key]
  })
  const unwantedKeys = config['content-connector'].unwantedKeys
  if (unwantedKeys && unwantedKeys.contentType && unwantedKeys.contentType.length !== 0) {
    unwantedKeys.contentType.forEach((key) => {
      delete contentType.data[key]
    })
  }

  return contentType
}

export const structuralChanges = (entity) => {
  const clone = cloneDeep(entity.data)
  const obj = {}

  indexedKeys.forEach((key) => {
    if (hasIn(entity, key)) {
      obj[key] = entity[key]
      clone[key] = entity[key]
    }
  })

  if (hasIn(clone, 'publish_details')) {
    clone.published_at = clone.publish_details.time
    clone.locale = clone.publish_details.locale
    delete clone.publish_details
  } else {
    // most prolly for content types (though, not required)
    clone.published_at = new Date().toISOString()
  }

  clone.sys_keys = obj

  return clone
}
