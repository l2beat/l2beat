import { projects } from '@l2beat/config'
import { setup } from './services'
import { SimpleDate } from './utils/SimpleDate'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const { dailyBlocks } = setup()

  const endDate = SimpleDate.today()
  const blocks = await dailyBlocks.getDailyBlocks(projects, endDate)
  console.log(blocks)
}
