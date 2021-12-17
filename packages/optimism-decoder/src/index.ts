import { run } from './run'

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
