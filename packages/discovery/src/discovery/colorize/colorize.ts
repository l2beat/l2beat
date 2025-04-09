import type { TemplateService } from '../analysis/TemplateService'
import { resolveCategory } from '../analysis/category'
import type { ExternalReference } from '../config/ColorConfig'
import type { ContractConfigColor } from '../config/ContractConfig'
import type { DiscoveryConfig } from '../config/DiscoveryConfig'
import type {
  DiscoveryOutput,
  EntryParameters,
  FieldMeta,
  StructureEntry,
  StructureOutput,
} from '../output/types'
import { get$Implementations } from '../utils/extractors'

export function colorize(
  config: DiscoveryConfig,
  structure: StructureOutput,
  templateService: TemplateService,
): DiscoveryOutput {
  const result: DiscoveryOutput = structure

  result.entries.forEach((e) => {
    const entryConfig = config.forColor(e.address)

    if (e.template !== undefined) {
      const templateColor = templateService.loadContractTemplateColor(
        e.template,
      )

      entryConfig.pushValues(templateColor)
    }

    e.name = entryConfig.name ?? entryConfig.displayName ?? e.derivedName
    e.displayName =
      entryConfig.displayName && e.name !== e.displayName
        ? e.displayName
        : undefined
    e.description = interpolateString(entryConfig.description, e)
    e.references = getReferences(entryConfig, e)
    e.category = resolveCategory(entryConfig)
    e.fieldMeta = getFieldsMeta(entryConfig)
  })

  result.entries = result.entries.map((e) => sortEntry(e))

  return result
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
    displayName: e.displayName,
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
    derivedName: e.derivedName,
    usedTypes: e.usedTypes,
    references: e.references,
    category: e.category,
  }
}

function interpolateString(
  description: string | undefined,
  structure: StructureEntry,
): string | undefined {
  if (description === undefined) {
    return undefined
  }

  return description.replace(/\{\{\s*((\$\.?)?\w+)\s*\}\}/g, (_match, key) => {
    const value =
      key === '$.address' ? structure.address : structure.values?.[key]
    if (value === undefined) {
      throw new Error(
        `Value for variable "{{ ${key} }}" in contract field not found in contract analysis`,
      )
    }
    return String(value)
  })
}

function getReferences(
  entryConfigColor: ContractConfigColor,
  entry: StructureEntry,
): ExternalReference[] | undefined {
  let result: ExternalReference[] | undefined
  if (entryConfigColor.references !== undefined) {
    result ??= []
    result.push(...entryConfigColor.references)
  }

  const addresses = [entry.address, ...get$Implementations(entry.values)]
  for (const address of addresses) {
    const manualSourcePath =
      entryConfigColor.manualSourcePaths[address.toString()]
    if (manualSourcePath === undefined) {
      continue
    }

    result ??= []
    result.push({
      text: 'Source Code',
      href: manualSourcePath,
    })
  }

  return result
}

function getFieldsMeta(
  entryConfigColor: ContractConfigColor,
): Record<string, FieldMeta> | undefined {
  const result: Record<string, FieldMeta> = {}

  for (const [key, value] of Object.entries(entryConfigColor.fields)) {
    if (value.severity === undefined && value.description === undefined) {
      continue
    }

    result[key] = {
      severity: value.severity,
      description: value.description,
      type: value.type,
    }
  }

  return Object.keys(result).length > 0 ? result : undefined
}
