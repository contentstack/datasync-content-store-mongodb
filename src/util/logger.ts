/*!
* Contentstack Mongodb Content Connector
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

import { validateLogger } from './validations'

interface ILogger {
  warn(): any,
  info(): any,
  log(): any,
  error(): any,
}

/**
 * @summary Creates a logger instance
 * @example
 *    const log = setLogger(instance)
 *    log.info('Hello world!')
 */
export const setLogger = (customLogger?: ILogger) => {
  if (logger) {
    return logger
  } else if (!validateLogger(customLogger) && !customLogger) {
    logger = console
    logger.info('Standard logger created')
  } else {
    logger = customLogger
    logger.info('Customized logger registered successfully!')
  }

  return logger
}

export let logger
