import type { TemplateService } from '../analysis/TemplateService'
import { resolveCategory } from '../analysis/category'
import type {
  ColorConfig,
  ColorContract,
  ExternalReference,
} from '../config/ColorConfig'
import { evaluateConfigForEntry } from '../config/ContractConfig'
import type {
  ColorOutput,
  FieldMeta,
  StructureEntry,
  StructureOutput,
} from '../output/types'
import { get$Implementations } from '../utils/extractors'

export function colorize(
  config: ColorConfig,
  structure: StructureOutput,
  templateService: TemplateService,
): ColorOutput {
  const result: ColorOutput = { entries: [] }

  for (const e of structure.entries) {
    const entryConfig = evaluateConfigForEntry(
      config,
      e.address,
      templateService.loadContractTemplateColor(e.template),
    )

    result.entries.push({
      name: entryConfig.name ?? entryConfig.displayName ?? e.derivedName,
      displayName: undefined, // TODO(radomski): This field is useless, can be removed
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
  entryConfig: ColorContract,
  entry: StructureEntry,
): ExternalReference[] | undefined {
  let result: ExternalReference[] | undefined
  if (entryConfig.references !== undefined) {
    result ??= []
    result.push(...entryConfig.references)
  }

  const addresses = [entry.address, ...get$Implementations(entry.values)]
  for (const address of addresses) {
    const manualSourcePath = entryConfig.manualSourcePaths[address.toString()]
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
  entryConfig: ColorContract,
): Record<string, FieldMeta> | undefined {
  const result: Record<string, FieldMeta> = {}

  for (const [key, value] of Object.entries(entryConfig.fields)) {
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
