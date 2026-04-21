import { expect } from 'earl'
import {
  getVisibleFlowChains,
  getVisibleHighlightedChains,
} from './getVisibleFlowChains'

describe(getVisibleFlowChains.name, () => {
  it('returns all selected chains as active when each chain has a flow', () => {
    const result = getVisibleFlowChains(
      ['ethereum', 'arbitrum', 'base'],
      [
        {
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          volume: 100,
          transferCount: 10,
        },
        {
          srcChain: 'base',
          dstChain: 'ethereum',
          volume: 50,
          transferCount: 5,
        },
      ],
    )

    expect(result).toEqual({
      activeChainIds: ['ethereum', 'arbitrum', 'base'],
      inactiveChainIds: [],
    })
  })

  it('splits active and inactive chains while preserving selected order', () => {
    const result = getVisibleFlowChains(
      ['optimism', 'ethereum', 'arbitrum', 'base'],
      [
        {
          srcChain: 'ethereum',
          dstChain: 'base',
          volume: 100,
          transferCount: 10,
        },
      ],
    )

    expect(result).toEqual({
      activeChainIds: ['ethereum', 'base'],
      inactiveChainIds: ['optimism', 'arbitrum'],
    })
  })

  it('marks all selected chains as inactive when there are no flows', () => {
    const result = getVisibleFlowChains(['ethereum', 'arbitrum'], [])

    expect(result).toEqual({
      activeChainIds: [],
      inactiveChainIds: ['ethereum', 'arbitrum'],
    })
  })
})

describe(getVisibleHighlightedChains.name, () => {
  it('removes highlighted chains that are no longer visible', () => {
    const result = getVisibleHighlightedChains(
      ['ethereum', 'arbitrum'],
      ['ethereum'],
    )

    expect(result).toEqual(['ethereum'])
  })

  it('preserves visible highlighted chains in their original order', () => {
    const result = getVisibleHighlightedChains(
      ['base', 'ethereum'],
      ['optimism', 'base', 'ethereum'],
    )

    expect(result).toEqual(['base', 'ethereum'])
  })
})
