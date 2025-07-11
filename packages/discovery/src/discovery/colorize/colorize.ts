import { resolveCategory } from '../analysis/category'
import type { TemplateService } from '../analysis/TemplateService'
import type {
  ColorConfig,
  ColorContract,
  ExternalReference,
} from '../config/ColorConfig'
import { makeEntryColorConfig } from '../config/colorUtils'
import type {
  ColorOutput,
  FieldMeta,
  StructureEntry,
  StructureOutput,
} from '../output/types'
import { get$Implementations } from '../utils/extractors'
import { interpolateString } from '../utils/interpolateString'

export function colorize(
  config: ColorConfig,
  structure: StructureOutput,
  templateService: TemplateService,
): ColorOutput {
  const result: ColorOutput = { entries: [] }

  for (const e of structure.entries) {
    const entryConfig = makeEntryColorConfig(
      config,
      e.address,
      templateService.loadContractTemplateColor(e.template),
    )

    result.entries.push({
      name: entryConfig.name ?? entryConfig.displayName ?? e.name,
      description: interpolateString(entryConfig.description, e),
      references: getReferences(entryConfig, e),
      category: resolveCategory(entryConfig),
      fieldMeta: getFieldsMeta(entryConfig),
    })
  }

  return result
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
