const console = require('./console')
const contentConnector = require('../dist')
const stringify = require('../dist/util/stringify').stringify
const assetConnector = require('./dummy-data/asset-connector')
const publish_entry = require('./dummy-data/publish/entries')
const publish_asset = require('./dummy-data/publish/assets')
const unpublish_entry = require('./dummy-data/unpublish/entries')
const unpublish_asset = require('./dummy-data/unpublish/assets')

contentConnector.start({}, assetConnector).then((mongoClient) => {
  mongoClient.publish(publish_entry).then((result) => {
    console.log(`Entry published successfully!\n${stringify(result)}`)
    // log('db' in mongoClient)
    // mongoClient.client.close()
  }).catch(console.error)
  mongoClient.publish(publish_asset).then((result) => {
    console.log(`Asset published successfully!\n${stringify(result)}`)
    // log('db' in mongoClient)
    // mongoClient.client.close()
  }).catch(console.error)
  mongoClient.unpublish(unpublish_entry).then((result) => {
    console.log(`Entry unpublished successfully!\n${stringify(result)}`)
    // log('db' in mongoClient)
    // mongoClient.client.close()
  }).catch(console.error)
  mongoClient.unpublish(unpublish_asset).then((result) => {
    console.log(`Asset unpublished successfully!\n${stringify(result)}`)
    // log('db' in mongoClient)
    // mongoClient.client.close()
  }).catch(console.error)
}).catch(console.error)
