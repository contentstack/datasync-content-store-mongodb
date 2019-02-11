
const contentConnector = require('../dist')
const assetConnector = require('./dummy-data/assetStore')
const publish_entry = require('./dummy-data/publish/entries')
const publish_asset = require('./dummy-data/publish/assets')
const unpublish_entry = require('./dummy-data/unpublish/entries')
const unpublish_asset = require('./dummy-data/unpublish/assets')
const delete_entry = require('./dummy-data/delete/entries')
const delete_asset = require('./dummy-data/delete/assets')
const delete_content_type = require('./dummy-data/delete/content-type')

function publish () {
  return new Promise(async (resolve, reject) => {
    try {
      const mongodbConnector = await contentConnector.start(assetConnector, {})
      const asset = await mongodbConnector.publish(publish_asset)
      const entry = await mongodbConnector.publish(publish_entry)
      // console.log('Publish result\nEntry: ' + JSON.stringify(entry) + '\nAsset: ' + JSON.stringify(asset))
      mongodbConnector.client.close()
      return resolve()
    } catch (error) {
      return reject(error)
    }
  })
}

async function unpublish () {
  return new Promise(async (resolve, reject) => {
    try {
      const mongodbConnector = await contentConnector.start(assetConnector, {})
      const asset = await mongodbConnector.unpublish(unpublish_asset)
      const entry = await mongodbConnector.unpublish(unpublish_entry)
      // console.log('Unpublish result\nEntry: ' + JSON.stringify(entry) + '\nAsset: ' + JSON.stringify(asset))
      mongodbConnector.client.close()
      return resolve()
    } catch (error) {
      return reject(error)
    }
  })
}

async function deleteContent () {
  return new Promise(async (resolve, reject) => {
    try {
      const mongodbConnector = await contentConnector.start(assetConnector, {})
      console.log('client' in mongodbConnector)
      const asset = await mongodbConnector.delete(delete_asset)
      const entry = await mongodbConnector.delete(delete_entry)
      await mongodbConnector.publish(publish_entry)
      await mongodbConnector.publish(publish_entry)
      const contentType = await mongodbConnector.delete(delete_content_type)
      // console.log('Delete result\nEntry: ' + JSON.stringify(entry) + '\nAsset: ' + JSON.stringify(asset) + '\nContent type: ' + JSON.stringify(contentType))
      mongodbConnector.client.close()
      return resolve()
    } catch (error) {
      return reject(error)
    }
  })
}

publish().then(() => {
  console.log('Entry and assets were published successuflly')
}).catch(console.error)

unpublish().then(() => {
  console.log('Entry and assets were unpublished successuflly')
}).catch(console.error)

deleteContent().then(() => {
  console.log('Entry, assets and content type were deleted successuflly')
}).catch(console.error)
