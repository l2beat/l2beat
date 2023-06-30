import { EthereumAddress } from '@l2beat/shared-pure'

export interface DiscoveryStackItem {
  address: EthereumAddress
  depth: number
  counter: number
}

export class DiscoveryStack {
  private readonly known = new Set<EthereumAddress>()
  private readonly stack: { address: EthereumAddress; depth: number }[] = []
  private counter = 0

  push(addresses: EthereumAddress[], depth: number) {
    const uniqueReversed = addresses
      .filter((x, i, a) => a.indexOf(x) === i)
      .reverse()
    const added = []
    for (const address of uniqueReversed) {
      if (this.known.has(address) || address === EthereumAddress.ZERO) {
        continue
      }
      this.stack.push({ address, depth })
      this.known.add(address)
      added.push(address)
    }
    return added.reverse()
  }

  isEmpty() {
    return this.stack.length === 0
  }

  pop(): DiscoveryStackItem {
    const item = this.stack.pop()
    if (!item) {
      throw new Error('Stack is empty')
    }
    this.counter++
    return { ...item, counter: this.counter }
  }
}
