/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

/**
 * @note 'SIGKILL' cannot have a listener installed, it will unconditionally terminate Node.js on all platforms.
 * @note 'SIGSTOP' cannot have a listener installed.
 */

import { getMongoClient } from './'

/**
 * @description Handles process exit. Stops the current application and manages a graceful shutdown
 * @param {String} signal - Process signal
 */
const handleExit = (signal) => {
  const killDuration = (process.env.KILLDURATION) ? calculateKillDuration() : 15000
  // tslint:disable-next-line: no-console
  console.info(`Received ${signal}. This will shut down the process in ${killDuration}ms..`)
  setInterval(abort, killDuration)
}

/**
 * https://www.joyent.com/node-js/production/design/errors
 * https://stackoverflow.com/questions/7310521/node-js-best-practice-exception-handling/23368579
 *
 * @description Manage unhandled errors
 * @param {Object} error - Unhandled error object
 */
const unhandledErrors = (error) => {
  console.error('Unhandled exception caught. Locking down process for 10s to recover..')
  console.error(error)
}

/**
 * @description Validates 'process.env.KILLDURATION' time passed
 */
const calculateKillDuration = () => {
  const killDuration = parseInt(process.env.KILLDURATION, 10)
  if (isNaN(killDuration)) {
    return 15000
  }

  return killDuration
}

/**
 * @description Aborts the current application
 */
const abort = () => {
  const mongoClient = getMongoClient()
  // close mongodb connection before exitting
  mongoClient.client.close()
  process.abort()
}

process.on('SIGTERM', handleExit)
process.on('SIGINT', handleExit)
process.on('uncaughtException', unhandledErrors)
