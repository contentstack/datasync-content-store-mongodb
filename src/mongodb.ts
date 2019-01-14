/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import Debug from 'debug'
import {
  filterAssetKeys,
  filterContentTypeKeys,
  filterEntryKeys,
} from './util/core-utilities'
import {
  validateAssetDelete,
  validateAssetPublish,
  validateAssetUnpublish,
  validateContentTypeDelete,
  validateEntryPublish,
  validateEntryRemove,
} from './util/validations'

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
  public assetConnector: any
  public db: any
  public client: any
  private collectionName: string

  constructor(mongodb, connector) {
    if (!mongo) {
      this.assetConnector = connector
      this.db = mongodb.db
      this.client = mongodb.client
      this.collectionName = 'contents'
      mongo = this
    }

    return mongo
  }

  /**
   * @description Generic publish method
   * @param {Object} data - Data to be published
   * @returns {Promise} Returns a promise
   */
  public publish(data) {
    return new Promise((resolve, reject) => {
      try {
        if (data.content_type_uid === '_assets') {
          return this.publishAsset(data).then(resolve).catch(reject)
        }

        return this.publishEntry(data).then(resolve).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @description Asset publish method
   * @param {Object} data - Asset to be published
   * @returns {Promise} Returns a promise
   */
  public publishAsset(data) {
    debug(`Asset publish called ${JSON.stringify(data)}`)

    return new Promise((resolve, reject) => {
      try {
        validateAssetPublish(data)
        filterAssetKeys(data)

        return this.assetConnector.download(data).then((asset) => {
          debug(`Asset download result ${JSON.stringify(asset)}`)
          this.db.collection(this.collectionName)
            .updateOne({
              locale: asset.locale,
              uid: asset.uid,
            }, {
              $set: asset,
            }, {
              upsert: true,
            })
            .then((result) => {
              debug(`Asset publish result ${JSON.stringify(result)}`)

              return resolve(asset)
            })
        }).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @description Entry publish method
   * @param {Object} data - Entry to be published
   * @returns {Promise} Returns a promise
   */
  public publishEntry(data) {
    debug(`Entry publish called ${JSON.stringify(data)}`)

    return new Promise((resolve, reject) => {
      try {
        validateEntryPublish(data)
        const entry = {
          content_type_uid: data.content_type_uid,
          data: data.data,
          locale: data.locale,
          uid: data.uid,
        }
        const contentType = {
          content_type_uid: 'contentTypes',
          data: data.content_type,
          uid: data.content_type_uid,
        }
        filterEntryKeys(entry)
        filterContentTypeKeys(contentType)

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

            return this.db.collection(this.collectionName)
              .updateOne({
                uid: contentType.content_type_uid,
              }, {
                $set: contentType,
              }, {
                upsert: true,
              })
              .then((contentTypeUpdateResult) => {
                debug(`Content type publish result ${contentTypeUpdateResult}`)

                return resolve(data)
              })
          }).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @description Generic unpublish method
   * @param {Object} data - Data unpublish query info
   * @returns {Promise} Returns a promise
   */
  public unpublish(data) {
    return new Promise((resolve, reject) => {
      try {
        if (data.content_type_uid === '_assets') {
          return this.unpublishAsset(data).then(resolve).catch(reject)
        }

        return this.unpublishEntry(data).then(resolve).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @description Generic delete method
   * @param {Object} data - Data delete query info
   * @returns {Promise} Returns a promise
   */
  public delete(data) {
    return new Promise((resolve, reject) => {
      try {
        if (data.content_type_uid === '_assets') {
          return this.deleteAsset(data).then(resolve).catch(reject)
        } else if (data.content_type_uid === '_content_types') {
          return this.deleteContentType(data).then(resolve).catch(reject)
        }

        return this.deleteEntry(data).then(resolve).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  public find(data) {
    return new Promise((resolve, reject) => {
      try {
        return resolve(data)
      } catch (error) {
        return reject(error)
      }
    })
  }

  public findOne(data) {
    return new Promise((resolve, reject) => {
      try {
        return resolve(data)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @description Entry unpublish method
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
   * @description Entry delete method
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
   * @description Asset unpublish method
   * @param {Object} asset - Asset unpublish query info
   * @returns {Promise} Returns a promise
   */
  private unpublishAsset(asset) {
    debug(`Unpublish asset called ${JSON.stringify(asset)}`)

    return new Promise((resolve, reject) => {
      try {
        validateAssetUnpublish(asset)

        return this.assetConnector.unpublish(asset).then(() => {
          return this.db.collection(this.collectionName)
            .deleteOne({
              content_type_uid: asset.content_type_uid,
              uid: asset.uid,
            })
            .then((result) => {
              debug(`Unpublish asset result ${JSON.stringify(result)}`)

              return resolve(asset)
            })
        }).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @description Asset delete method
   * @param {Object} entry - Asset delete query info
   * @returns {Promise} Returns a promise
   */
  private deleteAsset(asset) {
    debug(`Delete asset called ${JSON.stringify(asset)}`)

    return new Promise((resolve, reject) => {
      try {
        validateAssetDelete(asset)

        return this.assetConnector.delete(asset).then(() => {
          return this.db.collection(this.collectionName)
            .deleteMany({
              // data: {
              //   uid: asset.uid,
              // },
              'data.uid': asset.uid,
            })
            .then((result) => {
              debug(`Delete asset result ${JSON.stringify(result)}`)

              return resolve(asset)
            })
        }).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * @description Content type delete method
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
