const console = require('./console')
const contentConnector = require('../dist')
const stringify = require('../dist/util/stringify').stringify
const assetConnector = require('./dummy-data/asset-connector')
// const dEntry = require('./dummy-data/delete/entries')
const pEntry = require('./dummy-data/publish/entries')
const dAsset = require('./dummy-data/delete/assets')
const pAsset = require('./dummy-data/publish/assets')
const contentType = require('./dummy-data/delete/content-type')

contentConnector.start({}, assetConnector).then((mongoClient) => {
  // const entryPublishStatus = await mongoClient.delete(entry)
  // const entryDeleteStatus = await mongoClient.delete(entry)
  // const assetDeleteStatus = await mongoClient.delete(entry)
  // const entryPublishStatus2 = await mongoClient.delete(entry)
  // const contentTypeDeleteStatus = await mongoClient.delete(contentType)
  mongoClient.publish(pEntry).then((publishEntryStatus) => {
    console.log(stringify(publishEntryStatus))
    return
  }).then(() => {
    return mongoClient.delete(contentType).then((contentTypeDeleteStatus) => {
      console.log(stringify(contentTypeDeleteStatus))
      // mongoClient.client.close()
      return
    })
  }).then(() => {
    return mongoClient.publish(pAsset).then((assetPublishStatus) => {
      console.log(stringify(assetPublishStatus))
      // mongoClient.client.close()
      return
    })
  }).then(() => {
    return mongoClient.delete(dAsset).then((assetDeleteStatus) => {
      console.log(stringify(assetDeleteStatus))
      mongoClient.client.close()
    })
  })
})
