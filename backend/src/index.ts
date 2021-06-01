import { projects } from './projects'
import { setup } from './services'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const { config, blockInfo } = setup()

  const latestBlock = await blockInfo.getMaxBlockForDate(new Date())
  console.log(latestBlock)

  const promised = projects.map((project) => project(config))
  const results = await Promise.all(promised)
  console.log(results)
}
