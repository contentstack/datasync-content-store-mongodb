const console = require('./console')
const contentConnector = require('../dist')
const assetConnector = require('./dummy-data/assetStore')
// const dEntry = require('./dummy-data/delete/entries')
const pEntry = require('./dummy-data/publish/entries')
const dAsset = require('./dummy-data/delete/assets')
const pAsset = require('./dummy-data/publish/assets')
const contentType = require('./dummy-data/delete/content-type')

contentConnector.start({}, assetConnector).then((mongoClient) => {
  mongoClient.publish(pEntry).then((publishEntryStatus) => {
    console.log(publishEntryStatus)
    return
  }).then(() => {
    return mongoClient.delete(contentType).then((contentTypeDeleteStatus) => {
      console.log(contentTypeDeleteStatus)
      return
    })
  }).then(() => {
    return mongoClient.publish(pAsset).then((assetPublishStatus) => {
      console.log(assetPublishStatus)
      return
    })
  }).then(() => {
    return mongoClient.delete(dAsset).then((assetDeleteStatus) => {
      console.log(assetDeleteStatus)
      mongoClient.client.close()
    })
  })
})
