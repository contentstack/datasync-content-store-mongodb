/*!
 * Contentstack Mongodb Content Connector
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

import Debug from 'debug'
import {
  cloneDeep,
} from 'lodash'
import {
  filterAssetKeys,
  filterContentTypeKeys,
  filterEntryKeys,
  getCollectionName,
  getLocalesFromCollections,
} from './util/index'
import {
  validateAssetDelete,
  validateAssetPublish,
  validateAssetUnpublish,
  validateContentTypeDelete,
  validateContentTypeUpdate,
  validateEntryPublish,
  validateEntryRemove,
} from './util/validations'

const debug = Debug('mongodb-core')
let mongo = null

interface IAssetQuery {
  uid: string,
  locale: string,
  download_id ?: string,
  _version ?: number
}

interface IMongoConfig {
  dbName ?: string,
  collection ?: {
    entry ?: string,
    asset ?: string,
    schema ?: string,
  },
  collectionName ?: string,
  indexes ?: any,
  [propName: string]: any,
}

/**
 * @summary
 * Mongodb connector core class
 * @description
 * Handles publish, unpublish and delete data
 * @returns
 * Mongodb class instance
 */
export class Mongodb {
  public readonly assetStore: any
  public readonly db: any
  public readonly client: any
  public readonly config: IMongoConfig

  constructor(mongodb, assetStore: any, config: IMongoConfig) {
    if (!mongo) {
      this.assetStore = assetStore
      this.db = mongodb.db
      this.config = config
      this.client = mongodb.client
      mongo = this
    }

    return mongo
  }

  /**
   * @summary Generic publish method
   * @param {Object} data - Data to be published
   * @returns {Promise} Returns a promise
   */
  public async publish(data) {
    let response: any
    if (data._content_type_uid === '_assets') {
      response = await this.publishAsset(data)
    } else {
      response = await this.publishEntry(data)
    }

    return response
  }

  /**
   * @summary Asset publish method
   * @param {Object} data - Asset to be published
   * @returns {Promise} Returns a promise
   */
  public publishAsset(data) {
    debug(`Asset publish called ${JSON.stringify(data)}`)

    return new Promise(async (resolve, reject) => {
      try {
        let assetJSON = cloneDeep(data)
        validateAssetPublish(assetJSON)
        assetJSON = filterAssetKeys(assetJSON)

        if (assetJSON.hasOwnProperty('_version')) {
          await this.unpublish(data)
        }

        // remove if any published version exists first
        const asset: any = await this.assetStore.download(assetJSON)

        const query: IAssetQuery = {
          locale: asset.locale,
          uid: asset.uid,
        }
        if (asset.hasOwnProperty('download_id')) {
          query.download_id = asset.download_id
        } else {
          query._version = asset._version
        }

        const result = this.db.collection(getCollectionName(asset))
          .updateOne(query, {
            $set: assetJSON,
          }, {
            upsert: true,
        })
        debug(`Asset publish result ${JSON.stringify(result)}`)

        return resolve(data)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @summary Content type upsert method
   * @param {Object} contentType - Content type schema object
   * @returns {Promise} Returns a promise
   */
  public updateContentType(contentType) {
    debug(`Entry publish called ${JSON.stringify(contentType)}`)

    return new Promise(async (resolve, reject) => {
      try {
        let contentTypeJSON = cloneDeep(contentType)
        validateContentTypeUpdate(contentTypeJSON)
        contentTypeJSON = filterContentTypeKeys(contentTypeJSON)

        const contentTypeUpdateResult = await this.db
          .collection(getCollectionName(contentTypeJSON))
          .updateOne({
            _content_type_uid: contentTypeJSON._content_type_uid,
            uid: contentTypeJSON.uid,
          }, {
            $set: contentTypeJSON,
          }, {
            upsert: true,
          })
        debug(`Content type update result ${JSON.stringify(contentTypeUpdateResult)}`)

        return resolve(contentType)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @summary Entry publish method
   * @param {Object} entry - Entry to be published
   * @returns {Promise} Returns a promise
   */
  public publishEntry(entry) {
    debug(`Entry publish called ${JSON.stringify(entry)}`)

    return new Promise((resolve, reject) => {
      try {
        let entryJSON = cloneDeep(entry)
        validateEntryPublish(entryJSON)

        entryJSON = filterEntryKeys(entryJSON)

        return this.db.collection(getCollectionName(entryJSON))
          .updateOne({
            _content_type_uid: entryJSON._content_type_uid,
            locale: entryJSON.locale,
            uid: entryJSON.uid,
          }, {
            $set: entryJSON,
          }, {
            upsert: true,
          })
          .then((entryPublishResult) => {
            debug(`Entry publish result ${JSON.stringify(entryPublishResult)}`)

            return resolve(entry)
          }).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @summary Generic unpublish method
   * @param {Object} data - Data unpublish query info
   * @returns {Promise} Returns a promise
   */
  public async unpublish(data) {
    let result: any
    if (data._content_type_uid === '_assets') {
      result = await this.unpublishAsset(data)
    } else {
      result = await this.unpublishEntry(data)
    }

    return result
  }

  /**
   * @summary Generic delete method
   * @param {Object} data - Data delete query info
   * @returns {Promise} Returns a promise
   */
  public delete(data) {
    return new Promise((resolve, reject) => {
      if (data._content_type_uid === '_assets') {
        return this.deleteAsset(data)
          .then(resolve)
          .catch(reject)
      } else if (data._content_type_uid === '_content_types') {
        return this.deleteContentType(data)
          .then(resolve)
          .catch(reject)
      }

      return this.deleteEntry(data)
        .then(resolve)
        .catch(reject);
    })
  }

  /**
   * @summary Entry unpublish method
   * @param {Object} entry - Entry unpublish query info
   * @returns {Promise} Returns a promise
   */
  private unpublishEntry(entry) {
    debug(`Delete entry called ${JSON.stringify(entry)}`)

    return new Promise((resolve, reject) => {
      try {
        validateEntryRemove(entry)

        return this.db.collection(getCollectionName(entry))
          .deleteOne({
            _content_type_uid: entry._content_type_uid,
            locale: entry.locale,
            uid: entry.uid,
          })
          .then((result) => {
            debug(`Delete entry result ${JSON.stringify(result)}`)

            return resolve(entry)
          })
          .catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @summary Entry delete method
   * @param {Object} entry - Entry delete query info
   * @returns {Promise} Returns a promise
   */
  private deleteEntry(entry) {
    debug(`Delete entry called ${JSON.stringify(entry)}`)

    return new Promise((resolve, reject) => {
      try {
        validateEntryRemove(entry)

        return this.db.collection(getCollectionName(entry))
          .deleteMany({
            _content_type_uid: entry._content_type_uid,
            uid: entry.uid,
          })
          .then((result) => {
            debug(`Delete entry result ${JSON.stringify(result)}`)

            return resolve(entry)
          })
          .catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @summary Asset unpublish method
   * @param {Object} asset - Asset unpublish query info
   * @returns {Promise} Returns a promise
   */
  private unpublishAsset(asset) {
    debug(`Unpublish asset called ${JSON.stringify(asset)}`)

    return new Promise((resolve, reject) => {
      try {
        validateAssetUnpublish(asset)

        return this.db.collection(getCollectionName(asset))
          .findOneAndDelete({
            _content_type_uid: asset._content_type_uid,
            _version: {
              $exists: true,
            },
            locale: asset.locale,
            uid: asset.uid,
          })
          .then((result) => {
            debug(`Asset unpublish status: ${JSON.stringify(result)}`)
            if (result === null) {
              return resolve(asset)
            }

            return this.db.collection(getCollectionName(asset))
              .find({
                _content_type_uid: asset._content_type_uid,
                download_id: {
                  $exists: true,
                },
                locale: asset.locale,
                uid: asset.uid,
                url: result.url,
              })
              .toArray()
              .then((assets) => {
                if (assets.length === 0) {
                  debug(`Only published object of ${JSON.stringify(asset)} was present`)

                  return this.assetStore.unpublish(result.value)
                    .then(() => resolve(asset))
                }
                debug('Asset existed in pubilshed and RTE/Markdown form. Removed published asset object.')

                return resolve(asset)
              })
          })
          .catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @summary Asset delete method
   * @param {Object} entry - Asset delete query info
   * @returns {Promise} Returns a promise
   */
  private deleteAsset(asset) {
    debug(`Delete asset called ${JSON.stringify(asset)}`)

    return new Promise((resolve, reject) => {
      try {
        validateAssetDelete(asset)

        return this.db.collection(getCollectionName(asset))
          .find({
            _content_type_uid: '_assets',
            locale: asset.locale,
            uid: asset.uid,
          })
          .toArray()
          .then((result) => {
            if (result.length === 0) {
              debug('Asset did not exist!')

              return resolve(asset)
            }

            return this.db.collection(getCollectionName(asset))
              .deleteMany({
                _content_type_uid: '_assets',
                locale: asset.locale,
                uid: asset.uid,
              })
              .then(() => {
                return result
              })
          })
          .then((result) => {
            return this.assetStore.delete(result)
              .then(() => resolve(asset))
          })
          .catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @summary Content type delete method
   * @param {Object} contentType - Content type delete query info
   * @returns {Promise} Returns a promise
   */
  private deleteContentType(contentType) {
    debug(`Delete content type called ${JSON.stringify(contentType)}`)

    return new Promise(async (resolve, reject) => {
      try {
        validateContentTypeDelete(contentType)

        const collectionsResult: any[] = await this.db
          .listCollections({}, {nameOnly: true})
          .toArray()
        if (collectionsResult.length === 0) {
          return resolve(contentType)
        }
        const collections: Array<{name: string, locale: string}> = getLocalesFromCollections(collectionsResult)
        const promisifiedBucket: Array<Promise<{}>> = []
        collections.forEach((collection) => {
          promisifiedBucket.push(this.deleteCT(contentType.uid, collection))
        })

        return Promise.all(promisifiedBucket)
          .then(() => resolve(contentType))
      } catch (error) {
        return reject(error)
      }
    })
  }

  private deleteCT(uid, collection: {name: string, locale: string}) {
    return new Promise((resolve, reject) => {
      try {
        return this.db.collection(getCollectionName({_content_type_uid: uid, locale: collection.locale}))
          .deleteMany({
            _content_type_uid: uid,
          })
          .then((entriesDeleteResult) => {
            debug(`Delete entries result ${JSON.stringify(entriesDeleteResult)}`)

            return this.db.collection(collection.name)
              .deleteOne({
                _content_type_uid: '_content_types',
                uid,
              })
              .then((contentTypeDeleteResult) => {
                debug(`Content type delete result ${JSON.stringify(contentTypeDeleteResult)}`)

                return resolve(0)
              })
          })
          .catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }
// tslint:disable-next-line: max-file-line-count
}
