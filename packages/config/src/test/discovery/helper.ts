// TODO(radomski): This is duplicated in the l2b package, shouldn't be
import { createHash } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { ConfigReader } from '@l2beat/discovery'
import type { DiscoveryConfig, TemplateService } from '@l2beat/discovery'
import type { DiscoveryOutput } from '@l2beat/discovery-types'
import { Hash160 } from '@l2beat/shared-pure'
import { Hash256 } from '@l2beat/shared-pure'

const HASH_LINE_PREFIX = 'Generated with discovered.json: '

export function getDiscoveryHash(projectName: string, chain: string): Hash160 {
  const configReader = new ConfigReader(join(process.cwd(), '../config'))
  const curDiscovery = configReader.readDiscovery(projectName, chain)
  const hasher = createHash('sha1')
  hasher.update(JSON.stringify(curDiscovery))
  return Hash160(`0x${hasher.digest('hex')}`)
}

export function updateDiffHistoryHash(
  diffHistoryPath: string,
  projectName: string,
  chain: string,
) {
  let content = readFileSync(diffHistoryPath, 'utf-8')

  if (content.startsWith(HASH_LINE_PREFIX)) {
    content = content.split('\n').slice(2).join('\n')
  }

  const hash = getDiscoveryHash(projectName, chain)
  const hashLine = `${HASH_LINE_PREFIX}${hash.toString()}\n`

  writeFileSync(diffHistoryPath, `${hashLine}\n${content}`)
}

export function getDiffHistoryHash(
  diffHistoryPath: string,
): Hash160 | undefined {
  const content = readFileSync(diffHistoryPath, 'utf-8')
  const hashLine = content.split('\n')[0]
  if (hashLine.startsWith(HASH_LINE_PREFIX)) {
    const hashString = hashLine.slice(HASH_LINE_PREFIX.length)
    return Hash160(hashString)
  }
}

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
