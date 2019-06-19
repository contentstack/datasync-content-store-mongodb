/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import { getConfig } from '../index'

interface IContentStore {
  collectionName?: string,
  collection?: {
    entry: string,
    asset: string,
    schema: string,
  }
}

interface IConfig {
  contentStore: IContentStore,
  [propName: string]: any,
}

export const sanitizeConfig = (config: IConfig) => {
  if (typeof config.contentStore.collectionName === 'string' && config.contentStore.collectionName.length) {
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

export const getCollectionName = ({ locale, _content_type_uid }) => {
  const collection = getConfig().contentStore.collection
  switch (_content_type_uid) {
    case '_assets': 
      return `${locale}.${collection.asset}`
    case '_content_types':
      return `${locale}.${collection.schema}`
    default:
    return `${locale}.${collection.entry}`
  }
}

export const getLocalesFromCollections = (collections: {name: string, type: string}[]) => {
  const collectionConfig = getConfig().contentStore.collection
  const collectionDetails: {name: string, locale: string}[] = []

  collections.forEach((collection) => {
    const name = collection.name
    const namedArr = name.split('.')
    const locale: string = namedArr.splice(0, 1)[0]
    if (namedArr.length > 0) {
      const newCollectionName = namedArr.join('.')

      if (newCollectionName === collectionConfig.schema) {
        collectionDetails.push({
          name: collection.name,
          locale
        })
      }
    }
  })

  return collectionDetails
}
