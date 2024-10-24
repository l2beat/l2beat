import { resolvedChains } from '@l2beat/config/projects'
import { ChainConverter, ChainId } from '@l2beat/shared-pure'

export const chainConverter = new ChainConverter(
  resolvedChains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
)
