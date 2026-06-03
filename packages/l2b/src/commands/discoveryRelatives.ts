import {
  type ConfigRegistry,
  type EntryParameters,
  type TemplateService,
  toAddressArray,
} from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'

export type IgnoreSet = true | Set<string>

export function isFieldIgnored(set: IgnoreSet, field: string): boolean {
  return set === true || set.has(field)
}

export function effectiveIgnoreRelatives(
  { template: templateName, address }: EntryParameters,
  config: ConfigRegistry,
  templateService: TemplateService,
): { template: IgnoreSet; override: IgnoreSet } {
  const templateConfig =
    templateName && templateService.exists(templateName)
      ? templateService.loadContractTemplate(templateName)
      : undefined

  const template = toIgnoreSet(templateConfig?.ignoreRelatives)
  const override = toIgnoreSet(
    config.structure.overrides?.[address]?.ignoreRelatives,
  )

  return { template, override }
}

function toIgnoreSet(value: true | string[] | undefined): IgnoreSet {
  if (value === true) return true
  return new Set(value ?? [])
}

export function proxyFilteredAddresses(
  entry: EntryParameters,
): Set<ChainSpecificAddress> {
  if (!entry.values) return new Set()
  return new Set([
    ...toAddressArray(entry.values.$implementation),
    ...toAddressArray(entry.values.$beacon),
    ...toAddressArray(entry.values.$pastUpgrades),
  ])
}
