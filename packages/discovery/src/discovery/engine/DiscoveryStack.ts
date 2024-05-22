import { assert } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import { RelativeAddress } from '../analysis/AddressAnalyzer'

export interface DiscoveryStackItem {
  relative: RelativeAddress
  depth: number
  counter: number
}

export class DiscoveryStack {
  private readonly seen: RelativeAddress[] = []
  private readonly stack: {
    relative: RelativeAddress
    depth: number
  }[] = []
  private counter = 0

  push(relatives: RelativeAddress[], depth: number): EthereumAddress[] {
    const added = []
    for (const relative of relatives) {
      if (relative.address === EthereumAddress.ZERO) {
        continue
      }
      // If the same address has been seen before, but with a different
      // template, we should still add it to the stack
      const wasSeenWithTheSameTemplate =
        this.seen.find(
          (x) =>
            x.address === relative.address && x.template === relative.template,
        ) !== undefined
      if (wasSeenWithTheSameTemplate) {
        continue
      }
      this.stack.push({ relative, depth })
      this.seen.push(relative)
      added.push(relative.address)
    }
    return added
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
