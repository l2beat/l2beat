import { projects, tokenList } from '@l2beat/config'
import fs from 'fs'
import { projectToInfo, SimpleDate } from './model'
import { setup } from './services'
import { LegacyData, makeLegacyData } from './tools/makeLegacyData'
import { makeMockData } from './tools/makeMockData'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const { balanceCollector, config, asyncCache } = setup()

  const endDate = SimpleDate.today()
  const projectInfos = projects.map(projectToInfo)

  let legacyData
  if (config.mock) {
    legacyData = makeMockData(projectInfos, endDate)
  } else {
    const balances = await balanceCollector.collectBalanceInfo(
      projectInfos,
      tokenList,
      endDate
    )
    legacyData = makeLegacyData(balances)
  }

  await saveData(legacyData)

  if (config.updatePrecomputed) {
    asyncCache.updatePrecomputed()
  }
}

async function saveData(data: LegacyData) {
  if (!fs.existsSync('./build')) {
    await fs.promises.mkdir('./build')
  }
  await fs.promises.writeFile(
    './build/data.json',
    JSON.stringify(data, null, 2),
    'utf-8'
  )
}
