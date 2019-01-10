import Debug from 'debug'
import {
  filterAssetKeys,
  filterContentTypeKeys,
  filterEntryKeys,
} from './util/core-utilities'
import {
  stringify,
} from './util/stringify'
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

export class Mongodb {
  public assetConnector: any
  public db: any
  public client: any
  private assetCollectionName: string
  private entryCollectionName: string
  private contentTypeCollectionName: string

  constructor(mongodb, connector) {
    if (!mongo) {
      this.assetConnector = connector
      this.db = mongodb.db
      this.client = mongodb.client
      this.assetCollectionName = 'assets'
      this.entryCollectionName = 'entries'
      this.contentTypeCollectionName = 'content_types'
      mongo = this
    }

    return mongo
  }

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

  public publishAsset(data) {
    debug(`Asset publish called ${stringify(data)}`)

    return new Promise((resolve, reject) => {
      try {
        validateAssetPublish(data)
        filterAssetKeys(data)

        return this.assetConnector.download(data).then((asset) => {
          debug(`Asset download result ${stringify(asset)}`)
          this.db.collection(this.assetCollectionName)
            .updateOne({
              locale: asset.locale,
              uid: asset.uid,
            }, {
              $set: asset,
            }, {
              upsert: true,
            })
            .then((result) => {
              debug(`Asset publish result ${stringify(result)}`)

              return resolve(asset)
            })
        }).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  public publishEntry(data) {
    debug(`Entry publish called ${stringify(data)}`)

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
          locale: data.locale,
          uid: data.content_type_uid,
        }
        filterEntryKeys(entry)
        filterContentTypeKeys(contentType)

        return this.db.collection(this.entryCollectionName)
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

            return this.db.collection(this.contentTypeCollectionName)
              .updateOne({
                locale: contentType.locale,
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

  private unpublishEntry(entry) {
    debug(`Delete entry called ${stringify(entry)}`)

    return new Promise((resolve, reject) => {
      try {
        validateEntryRemove(entry)

        return this.db.collection(this.entryCollectionName)
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

  private deleteEntry(entry) {
    debug(`Delete entry called ${stringify(entry)}`)

    return new Promise((resolve, reject) => {
      try {
        validateEntryRemove(entry)

        return this.db.collection(this.entryCollectionName)
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

  private unpublishAsset(asset) {
    debug(`Unpublish asset called ${stringify(asset)}`)

    return new Promise((resolve, reject) => {
      try {
        validateAssetUnpublish(asset)

        return this.assetConnector.unpublish(asset).then(() => {
          return this.db.collection(this.assetCollectionName)
            .deleteOne({
              content_type_uid: asset.content_type_uid,
              uid: asset.uid,
            })
            .then((result) => {
              debug(`Unpublish asset result ${stringify(result)}`)

              return resolve(asset)
            })
        }).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  private deleteAsset(asset) {
    debug(`Delete asset called ${stringify(asset)}`)

    return new Promise((resolve, reject) => {
      try {
        validateAssetDelete(asset)

        return this.assetConnector.delete(asset).then(() => {
          return this.db.collection(this.assetCollectionName)
            .deleteMany({
              data: {
                uid: asset.uid,
              },
            })
            .then((result) => {
              debug(`Delete asset result ${stringify(result)}`)

              return resolve(asset)
            })
        }).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }

  private deleteContentType(contentType) {
    debug(`Delete content type called ${stringify(contentType)}`)

    return new Promise((resolve, reject) => {
      try {
        validateContentTypeDelete(contentType)

        return this.db.collection(this.entryCollectionName)
          .deleteMany({
            content_type_uid: contentType.uid,
          })
          .then((entriesDeleteResult) => {
            debug(`Delete entries result ${stringify(entriesDeleteResult)}`)

            return this.db.collection(this.contentTypeCollectionName)
              .deleteOne({
                uid: contentType.uid,
              })
              .then((contentTypeDeleteResult) => {
                debug(`Content type delete result ${stringify(contentTypeDeleteResult)}`)

                return resolve(contentType)
              })
          }).catch(reject)
      } catch (error) {
        return reject(error)
      }
    })
  }
}