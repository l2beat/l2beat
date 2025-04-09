import type { TemplateService } from '../analysis/TemplateService'
import { resolveCategory } from '../analysis/category'
import type { ExternalReference } from '../config/ColorConfig'
import type { ContractConfigColor } from '../config/ContractConfig'
import type { DiscoveryConfig } from '../config/DiscoveryConfig'
import type {
  ColorOutput,
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
): ColorOutput {
  const result: ColorOutput = { entries: [] }

  for (const e of structure.entries) {
    const entryConfig = config.forColor(e.address)

    if (e.template !== undefined) {
      const templateColor = templateService.loadContractTemplateColor(
        e.template,
      )

      entryConfig.pushValues(templateColor)
    }

    result.entries.push({
      name: entryConfig.name ?? entryConfig.displayName ?? e.derivedName,
      displayName: undefined, // entryConfig.displayName ? entryConfig.displayName : undefined,
      description: interpolateString(entryConfig.description, e),
      references: getReferences(entryConfig, e),
      category: resolveCategory(entryConfig),
      fieldMeta: getFieldsMeta(entryConfig),
    })
  }

  return result
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
