import { run } from './optimismDecodeTxBatch'

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
