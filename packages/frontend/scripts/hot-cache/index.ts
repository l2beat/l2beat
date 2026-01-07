import '../../src/dotenv'
import { getLogger } from '../../src/server/utils/logger'
import { hotCacheFns } from './hotCacheFns'

async function main() {
  await Promise.all(
    Object.entries(hotCacheFns).map(async ([key, fn]) => {
      console.time(key)
      const result = await fn()
      console.timeEnd(key)
      return result
    }),
  )

  // Flush logs before exiting to ensure all logs are sent to Elastic Search
  const logger = getLogger()
  await logger.flush()
}

main()
  .catch(console.error)
  .then(() => process.exit(0))
