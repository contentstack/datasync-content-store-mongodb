/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import { cloneDeep, merge } from 'lodash'
import { getConfig } from '../index'

export const sanitizeConfig = (config) => {
  if (typeof config.contentStore.collectionName === 'string' && config.contentStore.length) {
    config.contentStore.collection.entry = config.contentStore.collectionName
    config.contentStore.collection.asset = config.contentStore.collectionName
    config.contentStore.collection.schema = config.contentStore.collectionName

    delete config.contentStore.collectionName
  }

  return config
}

const maskKeys = (json, arr, pos) => {
  const key = arr[pos]
  if (json.hasOwnProperty(key)) {
    if (pos === arr.length - 1) {
      delete json[key]
    } else {
      pos++
      maskKeys(json[key], arr, pos)
    }
  } else if (typeof json === 'object' && json instanceof Array && json.length) {
    json.forEach((sub) => {
      maskKeys(sub, arr, pos)
    })
  }
}

/**
 * @summary Remove unwanted keys from json
 * @param {Object} type - asset/entry/content_type json
 */
const filter = (type, json) => {
  const contentStore = getConfig().contentStore
  const unwantedKeys = contentStore.unwantedKeys
  if (unwantedKeys && unwantedKeys[type] && Object.keys(unwantedKeys[type]).length !== 0) {
    const keyConfig = unwantedKeys[type]
    const filterKeys = Object.keys(keyConfig)
    filterKeys.forEach((key) => {
      if (keyConfig[key]) {
        maskKeys(json, key.split('.'), 0)
      }
    })
  }

  return json
}

/**
 * @summary Remove unwanted keys from asset json
 * @param {Object} asset - Asset json
 */
export const filterAssetKeys = (asset) => {
  return filter('asset', asset)
}

/**
 * @summary Remove unwanted keys from entry json
 * @param {Object} entry - Entry json
 */
export const filterEntryKeys = (entry) => {
  return filter('entry', entry)
}

/**
 * @summary Remove unwanted keys from content type json
 * @param {Object} contentType - Content type json
 */
export const filterContentTypeKeys = (contentType) => {
  return filter('contentType', contentType)
}

export const structuralChanges = (entity) => {
  const data = cloneDeep(entity.data)
  delete entity.data

  entity = merge(entity, data)

  return entity
}
