[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)

## Contentstack Sync Content Store MongoDB

The Contentstack Sync utility lets you sync your Contentstack data on your server, enabling you to save data locally and serve content directly from your server.

The Cotentstack MongoDB Content Store is part of Contentstack Sync utility's content storage drivers and is used to store data in the MongoDB database.

Learn how Contentstack helps you store your data locally with the help of the Contentstack Sync utility [here]().

Currently, Contentstack offers the following databases for storing the synced data:
- Filesystem data store: [contentstack-content-store-filesystem](https://github.com/contentstack/contentstack-content-store-filesystem)
- Filesystem asset store: [contentstack-asset-store-filesystem](https://github.com/contentstack/contentstack-asset-store-filesystem)
- Mongodb data store: [contentstack-content-store-mongodb](https://github.com/contentstack/contentstack-content-store-mongodb)

To notify contentstack-sync-manager, you can use a listener module - [contentstack-webhook-listener](https://github.com/contentstack/contentstack-webhook-listener) or your own personalized cron job can be used to invoke the app and sync the data on a regular interval.

### Prerequisite

- nodejs v8+
- MongoDB installed locally and it is up and running, or a MongoDB-atlas account

### Working

When an entry or an asset is published, unpublished or deleted, the listener fires a notification event and the [contentstack-sync-manager]() uses the `Contentstack's Sync API` to sync the latest changes.

Once the sync manager fetches the updated details from Contentstack, it passes them to the registered plugins and data connectors i.e. your mongodb.

Read more on how to get started with [Contentstack Sync Utility]()

## Documentation & Getting started

In order to get you upto speed, we've prepared quite a few documentation and examples that would help you to learn and understand on how to use the utilities.

- [Usage](#usage)
- [Configuration](#configuration)
- [Reference documentation](#reference-documentation)
- [Getting started examples](#getting-started-examples)
- [Migration](#migration-from-contentstack-express)

### Usage

The following code snippet is the bare basics to get you stared with using the Contentstack Sync Utility:

```js
const assetStore = require('contentstack-asset-store-filesystem')
const contentStore = require('contentstack-content-store-mongodb')
const listener = require('contentstack-webhook-listener')
const syncManager = require('contentstack-sync-manager')
const config = require('./config')

syncManager.setAssetStore(assetStore)
syncManager.setContentStore(contentStore)
syncManager.setListener(listener)
syncManager.setConfig(config)

syncManager.start()
  .then(() => {
    console.log('Contentstack sync started successfully!')
  })
  .catch(console.error)
```
You can replace [contentstack-content-store-mongodb]() used above, with [contentstack-content-store-filesystem]() and switch content store databases.

### Configuration

Here's a list of configuration keys for contentstack-sync-manager

- Contentstack configuration keys

| Key Name | Default | Description |
| :--- |:---:| :---|
| apiKey | | **Required**. Your stack's API key |
| deliveryToken | | **Required**. Your environment's delivery token |
| sync_token | | Token from where you'd like to start the process |
| pagination_token | | Token from where you'd like to start the process |
| MAX_RETRY_LIMIT | 6 | Number of times the API call would retry, if the server fails |

- MongoDB content store configuration keys

<!-- https://michelf.ca/projects/php-markdown/extra/ -->
<table>
  <thead>
    <tr>
      <th>Key Name</th>
      <th>Default value</th>
      <th>Key</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dbName</td>
      <td>contentstack-persistent-db</td>
      <td>Mongodb database name</td>
    </tr>
    <tr>
      <td>collectionName</td>
      <td>contents</td>
      <td>The database's collection name</td>
    </tr>
    <tr>
      <td>uri</td>
      <td>mongodb://localhost:27017</td>
      <td>URL string to the mongodb path to connect to</td>
    </tr>
    <tr>
      <td>unwantedKeys</td>
      <td>
        <ul>
          <li>asset.action: true</li>
          <li>asset.checkpoint: true</li>
          <li>asset.data.created_by: true</li>
          <li>asset.data.updated_by: true</li>
          <li>asset.event_at: true</li>
          <li>asset.type: true</li>
          <li>entry.action: true</li>
          <li>entry.checkpoint: true</li>
          <li>entry.data.created_by: true</li>
          <li>entry.data.updated_by: true</li>
          <li>entry.event_at: true</li>
          <li>entry.type: true</li>
          <li>content_type.data.created_by: true</li>
          <li>content_type.data.updated_by: true</li>
          <li>content_type.data.DEFAULT_ACL: true</li>
          <li>content_type.data.SYS_ACL: true</li>
          <li>content_type.data.abilities: true</li>
          <li>content_type.data.last_activity: true</li>
        </ul>
      </td>
      <td>You can remove keys from an item, that you do not wish to store in your database. In case you'd like to override any of the above, pass <code>key: false</code>. Ex: <code>asset.data.created_by: false</code> to keep <code>created_by</code> key in all of asset's json data.<br><strong>Note:</strong> These keys are respective of the <code>Sync API</code> json responses.</td>
    </tr>
    <tr>
      <td>indexes</td>
      <td>
        <ul>
          <li>published_at: -1</li>
          <li>content_type_uid: 1</li>
          <li>locale: 1</li>
          <li>uid: 1</li>
        </ul>
      </td>
      <td>Pass keys that you'd like the mongodb driver to create indexes on. The library will create indexes immidiately after it establishes connection with the mongodb url provided.</td>
    </tr>
    <tr>
      <td>options</td>
      <td>
        <ul>
          <li>options.autoReconnect: true</li>
          <li>options.connectTimeoutMS: 15000</li>
          <li>options.keepAlive: true</li>
          <li>options.noDelay: true</li>
          <li>options.reconnectInterval: 1000</li>
          <li>options.reconnectTries: 20</li>
          <li>options.useNewUrlParser: true</li>
        </ul>
      </td>
      <td>Options to be provided while setting up connection to the mongodb database. Ref Mongodb Docs - http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html for more option info.</td>
    </tr>
  </tbody>
</table>

### Reference documentation

The [Contentstack Sync Utility Docs]() documents what configuration, arguments, return types and methods are exposed by this utility.

### Getting started examples

You can refer to [contentstack-sync-boilerplate] on how to use this library along with listeners and data stores.

We have created a basic boilerplate on how to get started with creating a standard website using the Contentstack Sync Utility [here]()

### Migration from `contentstack-express`

If you are an existing [contentstack-express]() user, check out how you can migrate your existing website to use contentstack sync utilities [here]()

### Support and Feature requests

If you have any issues with the library, please file an issue [here](https://github.com/contentstack/contentstack-content-store-mongodb/issues) at Github.

You can [e-mail](mailto:ecosystem@contentstack.com) if you have any support or feature requests. Our dilligent minions will be working round the clock to help and serve you better!

### Licence

This repository is published under the [MIT](LICENSE) license.
