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
const shapeFilesHash = templateService.getShapeFilesHash()
const allTemplateHashes = templateService.getAllTemplateHashes()

void main().catch((e) => {
  console.log(e)
})

async function main() {
  const chainConfigs = await Promise.all(
    configReader
      .readAllChains()
      .flatMap((chain) => configReader.readAllConfigsForChain(chain)),
  )
  const toRefresh = []
  for (const config of chainConfigs) {
    const discovery = await configReader.readDiscovery(
      config.name,
      config.chain,
    )
    const needsRefreshReason = discoveryNeedsRefresh(discovery, config)
    if (needsRefreshReason !== undefined) {
      toRefresh.push({
        config,
        reason: needsRefreshReason,
      })
    }
  }

  if (toRefresh.length === 0) {
    console.log('All projects are up to date.')
  } else {
    console.log('Found projects that need discovery refresh:')
    for (const { config, reason } of toRefresh) {
      console.log(`- ${config.chain}/${config.name} (${reason})`)
    }
    console.log(`Overall ${toRefresh.length} projects need discovery refresh.`)
    if (keyInYN('Do you want to continue?')) {
      for (const { config } of toRefresh) {
        execSync(`yarn discover "${config.chain}" "${config.name}" --refresh`, {
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
  if (discovery.shapeFilesHash !== shapeFilesHash) {
    return 'some shape files have changed'
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
