import { Redis } from 'ioredis'
import { parseRedisUrl } from 'parse-redis-url-simple'
import { env } from '../env.js'

function createRedisConnection() {
  const [redisCredentials] = parseRedisUrl(env.REDIS_URL)

  if (!redisCredentials) {
    throw new Error('Could not parse Redis URL')
  }

  return new Redis({
    host: redisCredentials.host,
    port: redisCredentials.port,
    // Enforced by the BullMQ library
    // Do not change this value
    maxRetriesPerRequest: null,
  })
}

export const connection = createRedisConnection()
