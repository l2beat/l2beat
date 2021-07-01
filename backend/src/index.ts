import { projects, tokenList } from '@l2beat/config'
import { projectToInfo } from './model'
import { setup } from './services'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const { exchangeAddresses, tvlAnalyzer } = setup()
  const exchanges = await exchangeAddresses.getExchanges(tokenList)
  const projectInfos = projects.map(projectToInfo)
  const tvl = await tvlAnalyzer.getTVL(projectInfos, exchanges, 12_500_000)
  console.log(JSON.stringify(tvl, null, 2))
}
