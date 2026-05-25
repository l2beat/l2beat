import {
  type ConfigRegistry,
  type EntryParameters,
  type TemplateService,
  toAddressArray,
} from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'

export function effectiveIgnoreRelatives(
  { template: templateName, address }: EntryParameters,
  config: ConfigRegistry,
  templateService: TemplateService,
): { template: Set<string>; override: Set<string> } {
  const templateConfig =
    templateName && templateService.exists(templateName)
      ? templateService.loadContractTemplate(templateName)
      : undefined

  const template = new Set(templateConfig?.ignoreRelatives ?? [])

  const override = new Set(
    config.structure.overrides?.[address]?.ignoreRelatives ?? [],
  )

  return { template, override }
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
