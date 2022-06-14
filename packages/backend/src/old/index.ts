import { SimpleDate } from '@l2beat/common'
import { projects, tokenList } from '@l2beat/config'
import fs from 'fs'

import { projectToInfo } from '../model'
import { setup } from './services'
import { makeMockData } from './tools/makeMockData'
import { makeOutputData, OutputData } from './tools/makeOutputData'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const { statCollector, config, asyncCache } = setup()

  const endDate = SimpleDate.today()
  const projectInfos = projects.map(projectToInfo)

  let outputData
  if (config.mock) {
    outputData = makeMockData(projectInfos, endDate)
  } else {
    const stats = await statCollector.collectStats(
      projectInfos,
      tokenList,
      endDate,
    )
    outputData = makeOutputData(stats)
  }

  await saveData(outputData)

  if (config.updatePrecomputed) {
    asyncCache.updatePrecomputed()
  }
}

async function saveData(data: OutputData) {
  if (!fs.existsSync('./build')) {
    await fs.promises.mkdir('./build')
  }
  await fs.promises.writeFile(
    './build/data.json',
    JSON.stringify(data),
    'utf-8',
  )
}
