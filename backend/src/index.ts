import { projects } from './projects'
import { setup } from './services'
import { SimpleDate } from './services/SimpleDate'
import { getProjectTVLs, getTokenPrices } from './tools'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const { valueLockedChecker, tokenPriceChecker } = setup()

  const results = await getProjectTVLs(projects, valueLockedChecker)
  const getPrice = await getTokenPrices(results, tokenPriceChecker)
  console.log(getPrice('ETH', SimpleDate.today().addDays(-1)))
}
