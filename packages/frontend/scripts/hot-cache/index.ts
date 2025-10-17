import '../../src/dotenv'
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
}

main()
  .catch(console.error)
  .then(() => process.exit(0))
