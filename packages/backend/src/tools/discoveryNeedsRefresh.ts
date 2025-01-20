import { DiscoveryConfig, TemplateService } from '@l2beat/discovery'
import { DiscoveryOutput } from '@l2beat/discovery-types'
import { Hash256 } from '@l2beat/shared-pure'

// returns reason or undefined
export function discoveryNeedsRefresh(
  discovery: DiscoveryOutput,
  config: DiscoveryConfig,
  templateService: TemplateService,
): string | undefined {
  const allTemplateHashes = templateService.getAllTemplateHashes()
  const allShapes = templateService.getAllShapes()

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
      if (config.for(contract.address).extends === undefined) {
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
