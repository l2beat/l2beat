import { execSync } from 'child_process'
import {
  ConfigReader,
  DiscoveryConfig,
  TemplateService,
} from '@l2beat/discovery'
import { DiscoveryOutput } from '@l2beat/discovery-types'
import { keyInYN } from 'readline-sync'

const configReader = new ConfigReader()
const templateService = new TemplateService()
const allTemplateHashes = templateService.getAllTemplateHashes()
const allShapeHashes = templateService.getAllShapeHashes()

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
        execSync(`pnpm discover "${config.chain}" "${config.name}" --dev`, {
          stdio: 'inherit',
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

    if (contract.template !== undefined) {
      if (
        allShapeHashes[contract.template].length > 0 &&
        config.overrides.get(contract.address).extends === undefined &&
        !allShapeHashes[contract.template]
          .map((h) => h.toString())
          .includes(hashes[0])
      ) {
        return 'A contract which currently has a template, no longer matches that template'
      }
    } else {
      if (
        Object.values(allShapeHashes)
          .flatMap((h) => h.toString())
          .includes(hashes[0])
      ) {
        return 'A contract which currently does not have a template matches a template'
      }
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
    return `template configs have changed: ${outdatedTemplates.join(', ')}`
  }
}
