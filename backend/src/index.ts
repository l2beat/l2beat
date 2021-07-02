import { projects, tokenList } from '@l2beat/config'
import fs from 'fs'
import { projectToInfo, SimpleDate } from './model'
import { setup } from './services'
import { makeLegacyData } from './tools/makeLegacyData'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const { balanceCollector, config, asyncCache } = setup()

  const endDate = SimpleDate.today()
  const projectInfos = projects.map(projectToInfo)
  const balances = await balanceCollector.collectBalanceInfo(
    projectInfos,
    tokenList,
    endDate
  )

  const legacyData = makeLegacyData(balances)

  if (!fs.existsSync('./build')) {
    await fs.promises.mkdir('./build')
  }
  await fs.promises.writeFile(
    './build/data.json',
    JSON.stringify(legacyData, null, 2),
    'utf-8'
  )

  if (config.updatePrecomputed) {
    asyncCache.updatePrecomputed()
  }
}
