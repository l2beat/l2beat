import { expect } from 'earl'
import { InteropTransferClassifier } from './InteropTransferClassifier'

interface TestTransfer {
  id: string
  plugin: string
  bridgeType: 'lockAndMint' | 'burnAndMint' | 'nonMinting' | undefined
  type: string
  srcChain: string
  dstChain: string
  srcWasBurned: boolean | undefined
  dstWasMinted: boolean | undefined
  srcAbstractTokenId: string | undefined
  dstAbstractTokenId: string | undefined
}

describe(InteropTransferClassifier.name, () => {
  const classifier = new InteropTransferClassifier()

  it('matches transfers with OR between plugins and AND inside one plugin', () => {
    const transfers: TestTransfer[] = [
      transfer({
        id: 't1',
        plugin: 'plugin-a',
        bridgeType: 'lockAndMint',
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        srcAbstractTokenId: 'eth',
        dstAbstractTokenId: 'eth',
      }),
      transfer({
        id: 't2',
        plugin: 'plugin-a',
        bridgeType: 'lockAndMint',
        srcChain: 'ethereum',
        dstChain: 'base',
        srcAbstractTokenId: 'usdc',
        dstAbstractTokenId: 'usdc',
      }),
      transfer({
        id: 't3',
        plugin: 'plugin-b',
        bridgeType: 'nonMinting',
        type: 'deposit',
      }),
    ]

    const matched = classifier.filterTransfers(transfers, [
      {
        plugin: 'plugin-a',
        bridgeType: 'lockAndMint',
        chain: 'arbitrum',
        abstractTokenId: 'eth',
      },
      {
        plugin: 'plugin-b',
        bridgeType: 'nonMinting',
        transferType: 'deposit',
      },
    ])

    expect(matched.map((x) => x.id)).toEqual(['t1', 't3'])
  })

  it('uses explicit bridgeType when present, otherwise infers bridge type', () => {
    const transfers: TestTransfer[] = [
      transfer({
        id: 'explicit',
        plugin: 'plugin-a',
        bridgeType: 'lockAndMint',
        srcWasBurned: true,
        dstWasMinted: true,
      }),
      transfer({
        id: 'inferred',
        plugin: 'plugin-a',
        bridgeType: undefined,
        srcWasBurned: false,
        dstWasMinted: true,
      }),
      transfer({
        id: 'burn-and-mint',
        plugin: 'plugin-a',
        bridgeType: undefined,
        srcWasBurned: true,
        dstWasMinted: true,
      }),
    ]

    const result = classifier.classifyTransfers(transfers, [
      { plugin: 'plugin-a', bridgeType: 'lockAndMint' },
      { plugin: 'plugin-a', bridgeType: 'burnAndMint' },
    ])

    expect(result.lockAndMint.map((x) => x.id)).toEqual([
      'explicit',
      'inferred',
    ])
    expect(result.burnAndMint.map((x) => x.id)).toEqual(['burn-and-mint'])
    expect(result.nonMinting).toEqual([])
    expect(result.unknown).toEqual([])
  })
})

function transfer(override: Partial<TestTransfer>): TestTransfer {
  return {
    id: 'default',
    plugin: 'plugin-a',
    bridgeType: 'nonMinting',
    type: 'transfer',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    srcWasBurned: false,
    dstWasMinted: false,
    srcAbstractTokenId: 'eth',
    dstAbstractTokenId: 'eth',
    ...override,
  }
}
