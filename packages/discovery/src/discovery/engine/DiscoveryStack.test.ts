import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { DiscoveryStack } from './DiscoveryStack'

describe(DiscoveryStack.name, () => {
  const A = EthereumAddress.random()
  const B = EthereumAddress.random()
  const C = EthereumAddress.random()
  const D = EthereumAddress.random()

  it('pushes addresses to the stack', () => {
    const stack = new DiscoveryStack()
    const result = stack.push([A, B, C], 0)

    expect(result).toEqual([A, B, C])

    expect(stack.pop()).toEqual({ address: A, depth: 0, counter: 1 })
    expect(stack.pop()).toEqual({ address: B, depth: 0, counter: 2 })
    expect(stack.pop()).toEqual({ address: C, depth: 0, counter: 3 })
    expect(stack.isEmpty()).toEqual(true)
  })

  it('does not push duplicates in one go', () => {
    const stack = new DiscoveryStack()
    const result = stack.push([A, B, A], 0)

    expect(result).toEqual([A, B])

    expect(stack.pop()).toEqual({ address: A, depth: 0, counter: 1 })
    expect(stack.pop()).toEqual({ address: B, depth: 0, counter: 2 })
    expect(stack.isEmpty()).toEqual(true)
  })

  it('does not push duplicates in multiple goes', () => {
    const stack = new DiscoveryStack()

    const result1 = stack.push([A, B, A], 0)
    expect(result1).toEqual([A, B])

    const result2 = stack.push([C, B, D, C], 0)
    expect(result2).toEqual([C, D])

    expect(stack.pop()).toEqual({ address: C, depth: 0, counter: 1 })
    expect(stack.pop()).toEqual({ address: D, depth: 0, counter: 2 })
    expect(stack.pop()).toEqual({ address: A, depth: 0, counter: 3 })
    expect(stack.pop()).toEqual({ address: B, depth: 0, counter: 4 })
    expect(stack.isEmpty()).toEqual(true)
  })

  it('remembers historical addresses', () => {
    const stack = new DiscoveryStack()

    const result1 = stack.push([A, B], 0)
    expect(result1).toEqual([A, B])

    expect(stack.pop()).toEqual({ address: A, depth: 0, counter: 1 })

    const result2 = stack.push([C, A, D, B], 0)
    expect(result2).toEqual([C, D])

    expect(stack.pop()).toEqual({ address: C, depth: 0, counter: 2 })
    expect(stack.pop()).toEqual({ address: D, depth: 0, counter: 3 })
    expect(stack.pop()).toEqual({ address: B, depth: 0, counter: 4 })
    expect(stack.isEmpty()).toEqual(true)
  })

  it('filters out zero address', () => {
    const stack = new DiscoveryStack()
    const result = stack.push([A, EthereumAddress.ZERO], 0)

    expect(result).toEqual([A])

    expect(stack.pop()).toEqual({ address: A, depth: 0, counter: 1 })
    expect(stack.isEmpty()).toEqual(true)
  })

  it('preserves depth', () => {
    const stack = new DiscoveryStack()

    const result1 = stack.push([A], 42)
    expect(result1).toEqual([A])

    expect(stack.pop()).toEqual({ address: A, depth: 42, counter: 1 })
    expect(stack.isEmpty()).toEqual(true)
  })
})
