/**
 * @description Sets up an 'inmemory' mongod server
 */

import { MongoMemoryServer } from 'mongodb-memory-server'

// we want different contexts, but start only one mongod server

const mongod = new MongoMemoryServer({
  binary: {
    version: '3.1.18',
  },
  instance: {
    dbName: 'jest',
    port: 7003,
  },
})

/**
 * @description Creates an inmemory mongod instance
 */
export const createMongod = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!mongod.runningInstance) {
        await mongod.start()
      }
      const uri = await mongod.getConnectionString()

      return resolve({mongod, uri})
    } catch (error) {
      return reject(error)
    }
  })
}
