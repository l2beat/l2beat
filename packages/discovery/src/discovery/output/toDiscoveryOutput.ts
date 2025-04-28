import type {
  ColorOutput,
  DiscoveryOutput,
  EntryParameters,
  StructureOutput,
} from './types'

import { merge } from 'lodash'
import type { Analysis } from '../analysis/AddressAnalyzer'
import type { TemplateService } from '../analysis/TemplateService'
import { colorize } from '../colorize/colorize'
import type { ConfigRegistry } from '../config/ConfigRegistry'
import { neuterErrors } from './errors'
import { getStructureOutput } from './structureOutput'

export function toDiscoveryOutput(
  templateService: TemplateService,
  config: ConfigRegistry,
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
  config: ConfigRegistry,
  blockNumber: number,
  results: Analysis[],
): DiscoveryOutput {
  const structure = getStructureOutput(config.structure, blockNumber, results)
  const colorized = colorize(config.color, structure, templateService)

  return withoutUndefinedKeys(combineStructureAndColor(structure, colorized))
}

export function combineStructureAndColor(
  structure: StructureOutput,
  color: ColorOutput,
): DiscoveryOutput {
  const result = merge({}, structure, color)
  result.entries = result.entries.map((e) => sortEntry(e))
  return result
}

export function sortByKeys<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)),
  ) as T
}

export function withoutUndefinedKeys<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

export function sortEntry(e: EntryParameters): EntryParameters {
  return {
    name: e.name,
    address: e.address,
    type: e.type,
    unverified: e.unverified,
    template: e.template,
    sourceHashes: e.sourceHashes,
    proxyType: e.proxyType,
    description: e.description,
    issuedPermissions: e.issuedPermissions,
    receivedPermissions: e.receivedPermissions,
    directlyReceivedPermissions: e.directlyReceivedPermissions,
    ignoreInWatchMode: e.ignoreInWatchMode,
    sinceTimestamp: e.sinceTimestamp,
    sinceBlock: e.sinceBlock,
    values: e.values,
    errors: e.errors,
    fieldMeta: e.fieldMeta,
    implementationNames: e.implementationNames,
    usedTypes: e.usedTypes,
    references: e.references,
    category: e.category,
  }
}
