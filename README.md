
[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)

  Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read More](https://www.contentstack.com/).


## Contentstack DataSync Content Store MongoDB

  Contentstack DataSync lets you sync your Contentstack data with your database, enabling you to save data locally and serve content directly from your database. It is a combination of four powerful modules that is [DataSync Webhook Listener](https://github.com/contentstack/webhook-listener), [DataSync Manager](https://github.com/contentstack/datasync-manager), [DataSync Asset Store Filesystem](https://github.com/contentstack/datasync-asset-store-filesystem), DataSync Content Store — [Filesystem](https://github.com/contentstack/datasync-content-store-filesystem) and [MongoDB](https://github.com/contentstack/datasync-content-store-mongodb).

The Cotentstack MongoDB Content Store is part of [](https://github.com/contentstack/contentstack-content-store-mongodb/blob/master) Contentstack DataSync's content storage drivers and is used to store data in the MongoDB database. Any publish, unpublish, or delete action performed on content will be tracked by the  Webhook Listener and the relevant content will be synced accordingly in your MongoDB database.


##  Prerequisite

-   Node.js v8 or above
-   MongoDB installed locally and it is up and running, or a MongoDB-atlas account


## Usage

This is how the datasync-content-store-filesystem is defined in the boilerplate:
```js
const  assetStore = require('@contentstack/datasync-asset-store-filesystem')
const  contentStore = require('@contentstack/datasync-content-store-mongodb')// <<--
const  listener = require('@contentstack/webhook-listener')
const  syncManager = require('@contentstack/datasync-manager')
const  config = require('./config')

syncManager.setAssetStore(assetStore)
syncManager.setContentStore(contentStore)// Sets required asset store to sync manager.
syncManager.setListener(listener)
syncManager.setConfig(config)

syncManager.start()
.then(() => {
	console.log('Contentstack sync started successfully!')
})
.catch(console.error)
```


## Configuration
Here is the config table for the module:

By default, this module uses the following internal configuration.  
  

|Property|DataType|Description|Default|
|--|--|--|--|
|dbName|string|contentstack-persistent-db|**Optional.** The MongoDB database name|
|uri|string|mongodb://localhost:27017 |**Optional.** The MongoDB connection URI|
| indexedKeys | object |**[see config below](https://github.com/contentstack/datasync-content-store-mongodb#detailed-configs)** |**Optional.** keys that form part of sys_keys, pass { key: true } to add, { key: false } to remove currently, only top-level keys from SYNC API response item are supported|
|unwantedKeys|object|**[see config below](https://github.com/contentstack/datasync-content-store-mongodb#detailed-configs)** |**Optional.** Keys to be deleted, while data is being inserted|
|options|object|**[see config below](https://github.com/contentstack/datasync-content-store-mongodb#detailed-configs)** |**Optional.** The MongoDB connection options|


## Detailed configs
```js
indexedKeys: {
	content_type_uid:  true,
	locale:  true,
	uid:  true,
	published_at:  true
},

unwantedKeys: {
	asset: {
		action:  true,
		checkpoint:  true,
		'data.created_by':  true,
		event_at:  true,
		type:  true,
		'data.updated_by':  true
	},
	contentType: {
		'data.created_by':  true,
		'data.updated_by':  true,
		'data.DEFAULT_ACL':  true,
		'data.SYS_ACL':  true,
		'data.abilities':  true,
		'data.last_activity':  true
	},
	entry: {
		action:  true,
		checkpoint:  true,
		'data.created_by':  true,
		event_at:  true,
		type:  true,
		'data.updated_by':  true
	}
},

options: {
	autoReconnect:  true,
	connectTimeoutMS:  15000,
	keepAlive:  true,
	noDelay:  true,
	reconnectInterval:  1000,
	reconnectTries:  20,
	useNewUrlParser:  true,
},
```


## Further Reading

-   [Getting started with Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync)    
-   [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync/configuration-files-for-contentstack-datasync) doc lists the configuration for different modules


## Support and Feature requests

If you have any issues working with the library, please file an issue [here](https://github.com/contentstack/datasync-content-store-mongodb/issues) at Github.

You can send us an e-mail at [support@contentstack.com](mailto:support@contentstack.com) if you have any support or feature requests. Our support team is available 24/7 on the intercom. You can always get in touch and give us an opportunity to serve you better!


## License

This repository is published under the [MIT license](LICENSE).