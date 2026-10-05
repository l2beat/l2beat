/**
 * Everything the templatizer knows about one contract when it starts
 * authoring: what V1's proxy detector, source service and system handlers
 * produce for the address, read through the provider's cache. Prompt,
 * validator and dry run all read this one object, which is what keeps them
 * agreeing on the ABI, the baseline and the source the model was shown.
 */
import type { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { PROBED_INDICES } from '../handlers/getSystemHandlers'
import type { ContractValue } from '../output/types'
import type { PerContractSource } from '../source/SourceCodeService'

export interface ContractFacts {
  /** The project being discovered; the template id starts with it. */
  project: string
  /** Long chain name as the provider reports it, e.g. `ethereum`. */
  chain: string
  address: ChainSpecificAddress
  blockNumber: number
  /** `sources.name`: the contract name V1 derives, used for the template id. */
  name: string
  proxyType?: string
  /** V1's `$…` proxy values. Not referenceable from handlers, only facts. */
  proxyValues: Record<string, ContractValue | undefined>
  /** Implementation address → name, as the analyzer derives them. */
  implementationNames: Record<string, string>
  /** Proxy and implementation ABIs merged, as handlers see them. */
  abi: string[]
  /** Source bundles as the analyzer holds them, for shapes and flattening. */
  bundles: PerContractSource[]
  /** Every bundle flattened as V1 does at save time, for the prompt. */
  sources: FlatSource[]
  /** `getHashForMatchingFromSources(bundles)`: the shape the template is for. */
  shapeHash: Hash256
  baseline: Baseline
}

export interface FlatSource {
  address: ChainSpecificAddress
  name: string
  /** Empty when the bundle failed to flatten. */
  flattened: string
}

/** The indices V1 probes every single-`uint256` getter at, as the prompt names them: `0–4`. */
export const PROBE_RANGE = `0–${PROBED_INDICES - 1}`

/**
 * The values V1 computes for an address before any template: every
 * 0-argument getter (`getter`), every single-`uint256` getter probed at
 * `PROBE_RANGE` (`probe`), and whatever the address override in
 * `config.jsonc` adds (`override`). Which is which comes from V1's own
 * handler list for the address, not from the ABI. A draft field named like
 * one of these would replace it (`getHandlers` keeps the first field of a
 * name, and template fields come first), so the names are reserved.
 */
export interface Baseline {
  fields: Record<string, BaselineField>
}

export interface BaselineField {
  kind: 'getter' | 'probe' | 'override'
  value?: ContractValue
  error?: string
}
