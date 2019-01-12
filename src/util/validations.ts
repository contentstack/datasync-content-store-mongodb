/*!
* Contentstack Mongodb Content Store
* Copyright © 2019 Contentstack LLC
* MIT Licensed
*/

const requiredUpsertKeys = ['content_type_uid', 'locale', 'data', 'uid']
const requiredRemoveKeys = ['content_type_uid', 'locale', 'uid']

export const validateConfig = (config) => {
  if (typeof config['content-connector'].options !== 'object' || Object.keys(config['content-connector'].options).length
    === 0) {
    throw new Error('Content connector options cannot be empty!')
  } else if (typeof config['content-connector'].uri !== 'string' || config['content-connector'].uri.length === 0) {
    throw new Error('Content connector uri should be of type string and not empty!')
  }
}

export const validateAssetConnectorInstance = (instance) => {
  const keys = ['download', 'delete', 'unpublish']
  keys.forEach((fn) => {
    if (!(fn in instance) || typeof instance[fn] !== 'function') {
      throw new Error(`${JSON.stringify(instance)} connector does not have ${fn}`)
    }
  })
}

export const validateMongodbConfig = (config: any = {}) => {
  if (typeof config.uri !== 'string' || config.uri.length === 0) {
    throw new Error("Mongodb config 'uri' should be of type string and not empty!")
  } else if (typeof config.dbName !== 'string' || (config.dbName.length === 0 || config.dbName.length > 64)) {
    throw new Error("Mongodb config 'dbName' should be of type string and have length between '1-64'")
  } else if (typeof config.options !== 'object' || (Object.keys(config.options).length === 0)) {
    throw new Error("Mongodb config 'option' should be of type object and not empty!")
  }
}

export const validateAssetPublish = (asset) => {
  requiredUpsertKeys.forEach((key) => {
    if (!(key in asset)) {
      throw new Error(`${key} is missing in asset publish!`)
    }
  })
}

export const validateEntryPublish = (entry) => {
  requiredUpsertKeys.forEach((key) => {
    if (!(key in entry)) {
      throw new Error(`${key} is missing in entry publish!`)
    }
  })
}

export const validateEntryRemove = (entry) => {
  requiredRemoveKeys.forEach((key) => {
    if (!(key in entry)) {
      throw new Error(`${key} is missing in entry unpublish/delete!`)
    }
  })
}

export const validateAssetUnpublish = (asset) => {
  requiredRemoveKeys.forEach((key) => {
    if (!(key in asset)) {
      throw new Error(`${key} is missing in asset unpublish!`)
    }
  })
}

export const validateAssetDelete = (asset) => {
  requiredRemoveKeys.forEach((key) => {
    if (!(key in asset)) {
      throw new Error(`${key} is missing in asset delete!`)
    }
  })
}

export const validateContentTypeDelete = (contentType) => {
  const keys = ['content_type_uid', 'uid']
  keys.forEach((key) => {
    if (!(key in contentType)) {
      throw new Error(`${key} is missing in content type delete!`)
    }
  })
}

/**
 * @description Validates if the custom logger set supports required methods
 * @param {Object} instance - Custom logger instance
 */
export const validateLogger = (instance) => {
  let flag = false
  if (!instance) {
    return flag
  }
  const requiredFn = ['info', 'warn', 'log', 'error', 'debug']
  requiredFn.forEach((name) => {
    if (typeof instance[name] !== 'function') {
      console.warn(`Unable to register custom logger since '${name}()' does not exist on ${instance}!`)
      flag = true
    }
  })

  return !flag
}
