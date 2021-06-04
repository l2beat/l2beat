import fs from 'fs'
import { projects } from './projects'
import { setup } from './services'
import { getProjectTVLs, getTokenPrices } from './tools'
import { makeLegacyData } from './tools/makeLegacyData'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const { valueLockedChecker, tokenPriceChecker } = setup()

  const results = await getProjectTVLs(projects, valueLockedChecker)
  const getPrice = await getTokenPrices(results, tokenPriceChecker)
  const legacyData = makeLegacyData(results, getPrice)

  await fs.promises.writeFile(
    '../data/data.json',
    JSON.stringify(legacyData, null, 2),
    'utf-8'
  )
}
