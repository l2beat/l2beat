import { chains } from '@l2beat/config'
import { ChainConverter, ChainId } from '@l2beat/shared-pure'

export const chainConverter = new ChainConverter(
  chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
)
