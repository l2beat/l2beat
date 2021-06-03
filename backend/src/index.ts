import { projects } from './projects'
import { setup } from './services'
import { getProjectTVLs, getTokenPrices } from './tools'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const { valueLockedChecker, tokenPriceChecker } = setup()

  const results = await getProjectTVLs(projects, valueLockedChecker)
  await getTokenPrices(results, tokenPriceChecker)
}
