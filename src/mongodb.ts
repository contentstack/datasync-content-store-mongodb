/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import Debug from 'debug'
import { cloneDeep } from 'lodash'
import { filterAssetKeys, filterContentTypeKeys, filterEntryKeys, structuralChanges, } from './util/index'
import { validateAssetDelete, validateAssetPublish, validateAssetUnpublish, validateContentTypeDelete, validateEntryPublish, validateEntryRemove, } from './util/validations'

const debug = Debug('mongodb-core')
let mongo = null


/**
 * @summary
 * Mongodb connector core class
 * @description
 * Handles publish, unpublish and delete data
 * @returns
 * Mongodb class instance
 */
export class Mongodb {
  public assetStore: any
  public db: any
  public client: any
  private collectionName: string

  constructor(mongodb, assetStore, config = { collectionName: 'contents'}) {
    if (!mongo) {
      this.assetStore = assetStore
      this.db = mongodb.db
      this.client = mongodb.client
      this.collectionName = (config && config.collectionName) ? config.collectionName : 'contents'
      mongo = this
    }

    return mongo
  }

  /**
   * @summary Generic publish method
   * @param {Object} data - Data to be published
   * @returns {Promise} Returns a promise
   */
  public publish(data) {
    return new Promise((resolve, reject) => {
      try {
        if (data.content_type_uid === '_assets') {
          return this.publishAsset(data)
            .then(resolve)
            .catch(reject)
        }

        return this.publishEntry(data)
          .then(resolve)
          .catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
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
        assetJSON = structuralChanges(assetJSON)

        if (assetJSON.hasOwnProperty('_version')) {
          await this.unpublish(data)
        }

        // remove if any published version exists first
        return this.assetStore.download(assetJSON)
          .then((asset) => {
            const query: any = {
              uid: asset.uid,
              locale: asset.locale
            }
            if (asset.hasOwnProperty('download_id')) {
              query.download_id = asset.download_id
            } else {
              query._version = asset._version
            }

            return this.db.collection(this.collectionName)
              .updateOne(query, {
                $set: assetJSON,
              }, {
                upsert: true,
              })
          })
          .then((result) => {
            debug(`Asset publish result ${JSON.stringify(result)}`)

            return resolve(data)
          })
          .catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @summary Entry publish method
   * @param {Object} data - Entry to be published
   * @returns {Promise} Returns a promise
   */
  public publishEntry(data) {
    debug(`Entry publish called ${JSON.stringify(data)}`)

    return new Promise((resolve, reject) => {
      try {
        let contentType
        validateEntryPublish(data)
        let entry = {
          content_type_uid: data.content_type_uid,
          data: data.data,
          locale: data.locale,
          uid: data.uid,
        }

        if (data.hasOwnProperty('content_type')) {
          contentType = {
            content_type_uid: '_content_types',
            data: data.content_type,
            uid: data.content_type_uid,
          }
          contentType = filterContentTypeKeys(contentType)
          contentType = structuralChanges(contentType)
        }

        entry = filterEntryKeys(entry)
        entry = structuralChanges(entry)

        return this.db.collection(this.collectionName)
          .updateOne({
            content_type_uid: entry.content_type_uid,
            locale: entry.locale,
            uid: entry.uid,
          }, {
            $set: entry,
          }, {
            upsert: true,
          })
          .then((entryPublishResult) => {
            debug(`Entry publish result ${entryPublishResult}`)

            if (typeof contentType === 'object') {
              return this.db.collection(this.collectionName)
                .updateOne({
                  content_type_uid: contentType.content_type_uid,
                  uid: contentType.uid,
                }, {
                  $set: contentType,
                }, {
                  upsert: true,
                })
                .then((contentTypeUpdateResult) => {
                  debug(`Content type publish result ${contentTypeUpdateResult}`)

                  return resolve(data)
                })
            }

            return resolve(data)
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
  public unpublish(data) {
    return new Promise((resolve, reject) => {
      try {
        if (data.content_type_uid === '_assets') {
          return this.unpublishAsset(data)
            .then(resolve)
            .catch(reject)
        }

        return this.unpublishEntry(data).then(resolve).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @summary Generic delete method
   * @param {Object} data - Data delete query info
   * @returns {Promise} Returns a promise
   */
  public delete(data) {
    return new Promise((resolve, reject) => {
      try {
        if (data.content_type_uid === '_assets') {
          return this.deleteAsset(data)
            .then(resolve)
            .catch(reject)
        } else if (data.content_type_uid === '_content_types') {
          return this.deleteContentType(data)
            .then(resolve)
            .catch(reject)
        }

        return this.deleteEntry(data)
          .then(resolve)
          .catch(reject)
      } catch (error) {
        return reject(error)
      }
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

        return this.db.collection(this.collectionName)
          .deleteOne({
            content_type_uid: entry.content_type_uid,
            locale: entry.locale,
            uid: entry.uid,
          })
          .then((result) => {
            debug(`Delete entry result ${result}`)

            return resolve(entry)
          }).catch(reject)
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

        return this.db.collection(this.collectionName)
          .deleteMany({
            content_type_uid: entry.content_type_uid,
            uid: entry.uid,
          })
          .then((result) => {
            debug(`Delete entry result ${result}`)

            return resolve(entry)
          }).catch(reject)
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

        return this.db.collection(this.collectionName)
          .findOneAndDelete({
            content_type_uid: asset.content_type_uid,
            locale: asset.locale,
            uid: asset.uid,
            _version: {
              $exists: true
            }
          })
          .then((result) => {
            debug(`Asset unpublish status: ${JSON.stringify(result)}`)
            if (result.value === null) {
              return resolve(asset)
            }

            return this.db.collection(this.collectionName)
              .find({
                content_type_uid: asset.content_type_uid,
                locale: asset.locale,
                uid: asset.uid,
                url: result.value.url,
                download_id: {
                  $exists: true
                }
              })
              .toArray()
              .then((assets) => {
                if (assets.length === 0) {
                  debug(`Only published object of ${JSON.stringify(asset)} was present`)

                  return this.assetStore.unpublish(result.value)
                    .then(() => resolve(asset))
                }
                debug(`Asset existed in pubilshed and RTE/Markdown form. Removed published asset object.`)

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

        return this.db.collection(this.collectionName)
          .find({
            content_type_uid: '_assets',
            uid: asset.uid,
            locale: asset.locale
          })
          .toArray()
          .then((result) => {
            if (result.length === 0) {
              debug(`Asset did not exist!`)

              return resolve(asset)
            }

            return this.db.collection(this.collectionName)
              .deleteMany({
                content_type_uid: '_assets',
                uid: asset.uid,
                locale: asset.locale
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

    return new Promise((resolve, reject) => {
      try {
        validateContentTypeDelete(contentType)

        return this.db.collection(this.collectionName)
          .deleteMany({
            content_type_uid: contentType.uid,
          })
          .then((entriesDeleteResult) => {
            debug(`Delete entries result ${JSON.stringify(entriesDeleteResult)}`)

            return this.db.collection(this.collectionName)
              .deleteOne({
                uid: contentType.uid,
              })
              .then((contentTypeDeleteResult) => {
                debug(`Content type delete result ${JSON.stringify(contentTypeDeleteResult)}`)

                return resolve(contentType)
              })
          }).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }
}
