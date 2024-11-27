import {
  ConfigReader,
  DiscoveryConfig,
  TemplateService,
  getChainConfig,
} from '@l2beat/discovery'
import { DiscoveryOutput } from '@l2beat/discovery-types'
import { Hash256 } from '@l2beat/shared-pure'
import { keyInYN } from 'readline-sync'
import { discoverAndUpdateDiffHistory } from './discoveryWrapper'

const configReader = new ConfigReader()
const templateService = new TemplateService()
const allTemplateHashes = templateService.getAllTemplateHashes()
const allShapes = templateService.getAllShapes()

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
      : discoveryNeedsRefresh(discovery, config)
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

// returns reason or undefined
function discoveryNeedsRefresh(
  discovery: DiscoveryOutput,
  config: DiscoveryConfig,
): string | undefined {
  for (const contract of discovery.contracts) {
    if (contract.sourceHashes === undefined) {
      continue
    }
    const hashes =
      contract.sourceHashes.length === 1
        ? contract.sourceHashes
        : contract.sourceHashes.slice(1)

    if (hashes.length > 1) {
      // NOTE(radomski): Diamonds don't really work well with templates right now
      continue
    }

    const sourcesHash = Hash256(hashes[0])
    const matchingTemplates = templateService.findMatchingTemplatesByHash(
      sourcesHash,
      contract.address,
    )

    if (
      contract.template !== undefined &&
      allShapes[contract.template].hashes.length > 0
    ) {
      if (config.overrides.get(contract.address).extends === undefined) {
        if (matchingTemplates.length === 0) {
          return `A contract "${contract.name}" with template "${contract.template}", no longer matches any template`
        }
        if (contract.template !== matchingTemplates[0]) {
          return `A contract "${contract.name}" matches a different template: "${contract.template} -> ${matchingTemplates.join(', ')}"`
        }
      }
    } else if (matchingTemplates.length > 0) {
      return `A contract "${contract.name}" without template now matches: "${matchingTemplates.join(', ')}"`
    }
  }

  if (discovery.configHash !== config.hash) {
    return 'project config or used template has changed'
  }

  const outdatedTemplates = []
  for (const [templateId, templateHash] of Object.entries(
    discovery.usedTemplates,
  )) {
    if (templateHash !== allTemplateHashes[templateId]) {
      outdatedTemplates.push(templateId)
    }
  }

  if (outdatedTemplates.length > 0) {
    return `template configs has changed: ${outdatedTemplates.join(', ')}`
  }
}
