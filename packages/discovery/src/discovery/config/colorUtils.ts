import type { ChainSpecificAddress } from '@l2beat/shared-pure'
// biome-ignore lint/style/noRestrictedImports: esm
import { merge } from 'lodash'
import { type ColorConfig, ColorContract } from './ColorConfig.js'

export type ColorContractOverrides = ColorContract & {
  name?: string
}

export function makeEntryColorConfig(
  config: ColorConfig,
  address: ChainSpecificAddress,
  template: ColorContract,
): ColorContractOverrides {
  const name = (config.names ?? {})[address.toString()]
  const override =
    config.overrides?.[address.toString()] ?? ColorContract.parse({})

  const result = merge({}, template, {
    address,
    name,
    ...override,
    categories: merge(config.categories ?? {}, override.categories),
  })

  return result
}
