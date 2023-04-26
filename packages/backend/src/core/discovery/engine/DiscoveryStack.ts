import { EthereumAddress } from '@l2beat/shared'

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
    const filtered = addresses
      .filter((x) => !this.known.has(x) && x !== EthereumAddress.ZERO)
      // we reverse the addresses to make the traversal more logical
      .reverse()
    for (const address of filtered) {
      if (this.known.has(address) || address === EthereumAddress.ZERO) {
        continue
      }

      this.known.add(address)
      this.stack.push({ address, depth })
    }
    return filtered
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
