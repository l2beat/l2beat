import type { ChainId } from '../types/ChainId'

export class ChainConverter {
  private readonly nameToId = new Map<string, ChainId>()
  private readonly idToName = new Map<ChainId, string>()

  constructor(chains: { name: string; chainId: ChainId }[]) {
    for (const chain of chains) {
      this.nameToId.set(chain.name, chain.chainId)
      this.idToName.set(chain.chainId, chain.name)
    }
  }

  toChainId(name: string): ChainId {
    const id = this.nameToId.get(name)
    if (!id) {
      throw new Error(`Unknown chain name: ${name}`)
    }
    return id
  }

  toName(id: ChainId): string {
    const name = this.idToName.get(id)
    if (!name) {
      throw new Error(`Unknown chain id: ${id.valueOf()}`)
    }
    return name
  }
}
