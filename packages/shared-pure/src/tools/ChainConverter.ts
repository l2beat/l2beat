export class ChainConverter {
  private readonly nameToId = new Map<string, number>()
  private readonly idToName = new Map<number, string>()

  constructor(chains: { name: string; chainId: number | undefined }[]) {
    for (const chain of chains) {
      if (chain.chainId !== undefined) {
        this.nameToId.set(chain.name, chain.chainId)
        this.idToName.set(chain.chainId, chain.name)
      }
    }
  }

  toChainId(name: string): number {
    const id = this.nameToId.get(name)
    if (!id) {
      throw new Error(`Unknown chain name: ${name}`)
    }
    return id
  }

  toName(id: number | undefined): string {
    if (id === undefined) {
      throw new Error('Cannot find chains with undefined chainId')
    }
    const name = this.idToName.get(id)
    if (!name) {
      throw new Error(`Unknown chain id: ${id.valueOf()}`)
    }
    return name
  }
}
