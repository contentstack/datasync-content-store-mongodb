[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)

## Contentstack Mongodb Content Store

Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read More](https://www.contentstack.com/).

The cotentstack-content-store-mongodb is part of [contentstack-sync utility's]() content storage drivers and is used to store data in mongodb. Learn how Contentstack helps you store your data locally with the help of the Sync Utility [here]()

Currently, Contentstack provides the following databases for storing synced data
- [contentstack-content-store-filesystem]()
- [contentstack-asset-store-filesystem]()
- [contentstack-content-store-mongodb]()

**[contentstack-webhook-listener]()** or your own personalized cron job can be used to invoke the app and sync the data on a regular basis.

**[contentstack-sync-manager]()** is used to integrate and bind all the modules.

Any publish/unpublish/delete action performed on Contentstack, will be tracked and the data will be synced with mongodb accordingly.

### Prerequisite

- nodejs v8 or above
- mongodb installed locally or an mongodb-atlas account

### Sample

Here's a boiler plate on how to use the utilities

```js
  const assetStore = require('contentstack-asset-store-filesystem')
  const contentStore = require('contentstack-content-store-mongodb')
  const listener = require('contentstack-webhook-listener')

  const config = require('./config')
  const syncManager = require('./dist')

  syncManager.setAssetStore(assetStore)
  syncManager.setContentStore(contentStore)
  syncManager.setListener(listener)
  syncManager.setConfig(config)

  syncManager.start().then(() => {
    console.log('App started successfully!')
  }).catch((error) => {
    console.error(error)
  })
```

### Config

By default, this module uses the following internal configuration.

```js
<!-- DB name -->
  dbName: 'contentstack-persistent-db',
<!-- DB connection options -->
  options: {
    autoReconnect: true,
    connectTimeoutMS: 15000,
    keepAlive: true,
    noDelay: true,
    reconnectInterval: 1000,
    reconnectTries: 20,
    userNewUrlParser: true,
  },
<!-- Mongodb connection string -->
  uri: 'mongodb://localhost:27017',
```
(Note: All the internal configuration can be overridden!)

Here's a sample config to help you get started!
```js
{
  "contentStore": {
    dbName: "my-contentstack-data"
  },
  "contentstack": {
    "apiKey": "",
    "token": ""
  },
  "plugins": {
    "myplugin": {
      "greetings": ["Hello there!", "Ola amigo!"]
    }
  },
  "syncManager": {
    "cooloff": 3000,
    "limit": 40,
  }
}
```