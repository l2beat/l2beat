import { projects, tokenList } from '@l2beat/config'
import { projectToInfo, SimpleDate } from './model'
import { setup } from './services'

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
  console.log(balances[balances.length - 1].balances.TVL)

  if (config.updatePrecomputed) {
    asyncCache.updatePrecomputed()
  }
}
