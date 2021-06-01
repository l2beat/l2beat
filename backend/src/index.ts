import { projects } from './projects'
import { setup, SimpleDate } from './services'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const { config, blockInfo } = setup()

  const block = await blockInfo.getMaxBlock(SimpleDate.today())
  console.log(block)

  const promised = projects.map((project) => project(config))
  const results = await Promise.all(promised)
  console.log(results)
}
