/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import { cloneDeep, hasIn, merge } from 'lodash'
import { getConfig } from '../index'

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
  const contentStore = getConfig().contentStore
  const indexedKeys = contentStore.indexedKeys
  if (indexedKeys && typeof indexedKeys === 'object' && Object.keys(indexedKeys).length) {
    let clone = cloneDeep(entity.data)
    const obj: any = {}
    obj.synced_at = new Date().toISOString()
    clone.synced_at = obj.synced_at

    for (let key in indexedKeys) {
      if (indexedKeys[key]) {
        if (hasIn(entity, key)) {
          obj[key] = entity[key]
          clone[key] = entity[key]
        }
      }
    }
  
    if (hasIn(clone, 'publish_details')) {
      clone.published_at = clone.publish_details.time
      clone.locale = clone.publish_details.locale
      delete clone.publish_details
    } else {
      // most prolly for content types (though, not required)
      clone.published_at = new Date().toISOString()
    }
  
    clone = merge(clone, obj)

    return clone
  }

  return entity
}

export const buildReferences = (schema, references = {}, parent?) => {
  for (let i = 0, l = schema.length; i < l; i++) {
    if (schema[i] && schema[i].data_type && schema[i].data_type === 'reference') {
      const field = ((parent) ? `${parent}.${schema[i].uid}`: schema[i].uid)
      references[field] = schema[i].reference_to
    } else if (schema[i] && schema[i].data_type && schema[i].data_type === 'group' && schema[i].schema) {
      buildReferences(schema[i].schema, references, ((parent) ? `${parent}.${schema[i].uid}`: schema[i].uid))
    }
  }

  return references
}
