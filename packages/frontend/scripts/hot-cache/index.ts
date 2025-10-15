import { getEnv } from '@l2beat/backend-tools'
import { hotCacheFns } from './hotCacheFns'

async function main() {
  const env = getEnv()
  console.log(env)
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
