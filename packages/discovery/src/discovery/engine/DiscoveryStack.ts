import { assert } from '@l2beat/backend-tools'

import { EthereumAddress } from '../../utils/EthereumAddress'

export interface DiscoveryStackItem {
  address: EthereumAddress
  depth: number
  counter: number
}

export class DiscoveryStack {
  private readonly known = new Set<EthereumAddress>()
  private readonly stack: { address: EthereumAddress; depth: number }[] = []
  private counter = 0

  push(addresses: EthereumAddress[], depth: number): EthereumAddress[] {
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

  isEmpty(): boolean {
    return this.stack.length === 0
  }

  popAll(): DiscoveryStackItem[] {
    assert(this.stack.length > 0, 'Stack is empty, cannot pop')

    const result = this.stack.map((s) => ({
      ...s,
      counter: this.counter++,
    }))
    this.stack.splice(0, this.stack.length)

    return result
  }

  pop(): DiscoveryStackItem {
    const item = this.stack.pop()
    if (!item) {
      throw new Error('Stack is empty')
    }
    this.counter++
    return { ...item, counter: this.counter }
  }

  getAddressCount(): number {
    return this.counter
  }
}
