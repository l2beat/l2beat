import type { DiscoveryOutput } from './types'

import type { Analysis } from '../analysis/AddressAnalyzer'
import type { TemplateService } from '../analysis/TemplateService'
import { colorize } from '../colorize/colorize'
import type { DiscoveryConfig } from '../config/DiscoveryConfig'
import { neuterErrors } from './errors'
import { getStructureOutput } from './structureOutput'

export function toDiscoveryOutput(
  templateService: TemplateService,
  config: DiscoveryConfig,
  blockNumber: number,
  results: Analysis[],
): DiscoveryOutput {
  const discovery = toRawDiscoveryOutput(
    templateService,
    config,
    blockNumber,
    results,
  )

  discovery.entries.forEach((e) => {
    if (e.errors !== undefined) {
      e.errors = sortByKeys(neuterErrors(e.errors))
    }
  })

  return discovery
}

export function toRawDiscoveryOutput(
  templateService: TemplateService,
  config: DiscoveryConfig,
  blockNumber: number,
  results: Analysis[],
): DiscoveryOutput {
  const structure = getStructureOutput(config, blockNumber, results)
  const colorized = colorize(config, structure, templateService)
  return colorized
}

export function sortByKeys<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)),
  ) as T
}
