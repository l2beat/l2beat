import {
  ConfigReader,
  DiscoveryConfig,
  TemplateService,
  getChainConfig,
} from '@l2beat/discovery'
import { keyInYN } from 'readline-sync'
import { discoveryNeedsRefresh } from '../src/tools/discoveryNeedsRefresh'
import { discoverAndUpdateDiffHistory } from './discoveryWrapper'

const configReader = new ConfigReader()
const templateService = new TemplateService()

void main().catch((e) => {
  console.log(e)
})

// Hello future reader. Please set this to a project you errored on e.g. zklinknova/blast
const from: string | undefined = undefined

async function main() {
  const refreshAll = process.argv.includes('--all')
  const chainConfigs = await Promise.all(
    configReader
      .readAllChains()
      // .filter((chain) => chain !== 'bsc' && chain !== 'ethereum' && chain !== 'nova' && chain !== 'optimism' && chain !== 'arbitrum' && chain !== 'blast')
      .flatMap((chain) => configReader.readAllConfigsForChain(chain)),
  )
  const toRefresh: { config: DiscoveryConfig; reason: string }[] = []
  let foundFrom = false
  for (const config of chainConfigs) {
    if (from !== undefined) {
      if (!foundFrom && `${config.name}/${config.chain}` === from) {
        foundFrom = true
      }
      if (!foundFrom) {
        continue
      }
    }
    const discovery = configReader.readDiscovery(config.name, config.chain)
    const needsRefreshReason = refreshAll
      ? '--all flag was provided'
      : discoveryNeedsRefresh(discovery, config, templateService)
    if (needsRefreshReason !== undefined) {
      toRefresh.push({
        config,
        reason: needsRefreshReason,
      })
    }
  }

  if (toRefresh.length === 0) {
    console.log(
      'All projects are up to date. Pass --all flag to refresh anyway.',
    )
  } else {
    console.log('Found projects that need discovery refresh:')
    for (const { config, reason } of toRefresh) {
      console.log(`- ${config.chain}/${config.name} (${reason})`)
    }
    console.log(
      `\nOverall ${toRefresh.length} projects need discovery refresh.`,
    )
    if (keyInYN('Do you want to continue?')) {
      for (const { config } of toRefresh) {
        await discoverAndUpdateDiffHistory({
          project: config.name,
          chain: getChainConfig(config.chain),
          dev: true,
        })
      }
    }
  }
}
