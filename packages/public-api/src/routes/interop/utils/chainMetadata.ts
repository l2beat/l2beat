import { INTEROP_CHAINS } from '@l2beat/config'

export const chainMetadata = new Map(
  INTEROP_CHAINS.map((chain) => [chain.id, { id: chain.id, name: chain.name }]),
)
