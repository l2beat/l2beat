import { expect } from 'earl'
import { reconcileNetworks } from './reconcileNetworks'

interface TestNetwork {
  chain: string
  rpcUrl?: string
  blockNumber?: number
}

describe(reconcileNetworks.name, () => {
  it('returns all networks as updated when previous is undefined', () => {
    const latest: TestNetwork[] = [
      { chain: 'ethereum', rpcUrl: 'https://eth.rpc' },
      { chain: 'optimism', rpcUrl: 'https://op.rpc' },
    ]

    const result = reconcileNetworks(undefined, latest)

    expect(result).toEqual({
      removed: [],
      updated: latest,
    })
  })

  it('returns empty arrays when both previous and latest are empty', () => {
    const result = reconcileNetworks([], [])

    expect(result).toEqual({
      removed: [],
      updated: [],
    })
  })

  it('identifies removed networks', () => {
    const previous: TestNetwork[] = [
      { chain: 'ethereum', rpcUrl: 'https://eth.rpc' },
      { chain: 'optimism', rpcUrl: 'https://op.rpc' },
      { chain: 'arbitrum', rpcUrl: 'https://arb.rpc' },
    ]

    const latest: TestNetwork[] = [
      { chain: 'ethereum', rpcUrl: 'https://eth.rpc' },
      { chain: 'optimism', rpcUrl: 'https://op.rpc' },
    ]

    const result = reconcileNetworks(previous, latest)

    expect(result).toEqual({
      removed: ['arbitrum'],
      updated: [],
    })
  })

  it('identifies updated networks when properties change', () => {
    const previous: TestNetwork[] = [
      { chain: 'ethereum', rpcUrl: 'https://eth.rpc', blockNumber: 100 },
      { chain: 'optimism', rpcUrl: 'https://op.rpc', blockNumber: 200 },
    ]

    const latest: TestNetwork[] = [
      { chain: 'ethereum', rpcUrl: 'https://eth.rpc', blockNumber: 101 }, // changed
      { chain: 'optimism', rpcUrl: 'https://op.rpc', blockNumber: 200 },
    ]

    const result = reconcileNetworks(previous, latest)

    expect(result).toEqual({
      removed: [],
      updated: latest,
    })
  })

  it('identifies new networks as updated', () => {
    const previous: TestNetwork[] = [
      { chain: 'ethereum', rpcUrl: 'https://eth.rpc' },
    ]

    const latest: TestNetwork[] = [
      { chain: 'ethereum', rpcUrl: 'https://eth.rpc' },
      { chain: 'optimism', rpcUrl: 'https://op.rpc' }, // new
    ]

    const result = reconcileNetworks(previous, latest)

    expect(result).toEqual({
      removed: [],
      updated: latest,
    })
  })

  it('handles both removed and updated networks', () => {
    const previous: TestNetwork[] = [
      { chain: 'ethereum', rpcUrl: 'https://eth.rpc', blockNumber: 100 },
      { chain: 'optimism', rpcUrl: 'https://op.rpc' },
      { chain: 'arbitrum', rpcUrl: 'https://arb.rpc' },
    ]

    const latest: TestNetwork[] = [
      { chain: 'ethereum', rpcUrl: 'https://eth.rpc', blockNumber: 101 }, // changed
      { chain: 'base', rpcUrl: 'https://base.rpc' }, // new
    ]

    const result = reconcileNetworks(previous, latest)

    expect(result.removed).toEqualUnsorted(['optimism', 'arbitrum'])
    expect(result.updated).toEqualUnsorted([
      { chain: 'optimism', rpcUrl: 'https://op.rpc' }, // removed network
      { chain: 'arbitrum', rpcUrl: 'https://arb.rpc' }, // removed network
      { chain: 'ethereum', rpcUrl: 'https://eth.rpc', blockNumber: 101 }, // all latest networks
      { chain: 'base', rpcUrl: 'https://base.rpc' },
    ])
  })

  it('returns empty updated array when networks are identical', () => {
    const networks: TestNetwork[] = [
      { chain: 'ethereum', rpcUrl: 'https://eth.rpc', blockNumber: 100 },
      { chain: 'optimism', rpcUrl: 'https://op.rpc', blockNumber: 200 },
    ]

    const result = reconcileNetworks(networks, networks)

    expect(result).toEqual({
      removed: [],
      updated: [],
    })
  })

  it('handles networks with only chain property', () => {
    const previous = [{ chain: 'ethereum' }, { chain: 'optimism' }]
    const latest = [{ chain: 'ethereum' }, { chain: 'arbitrum' }]

    const result = reconcileNetworks(previous, latest)

    expect(result).toEqual({
      removed: ['optimism'],
      updated: [...latest, { chain: 'optimism' }],
    })
  })

  it('detects changes in nested properties', () => {
    interface ComplexNetwork {
      chain: string
      config: {
        rpcUrl: string
        timeout: number
      }
    }

    const previous: ComplexNetwork[] = [
      {
        chain: 'ethereum',
        config: { rpcUrl: 'https://eth.rpc', timeout: 5000 },
      },
    ]

    const latest: ComplexNetwork[] = [
      {
        chain: 'ethereum',
        config: { rpcUrl: 'https://eth.rpc', timeout: 10000 }, // timeout changed
      },
    ]

    const result = reconcileNetworks(previous, latest)

    expect(result).toEqual({
      removed: [],
      updated: latest,
    })
  })

  it('handles removal of all networks', () => {
    const previous: TestNetwork[] = [
      { chain: 'ethereum', rpcUrl: 'https://eth.rpc' },
      { chain: 'optimism', rpcUrl: 'https://op.rpc' },
    ]

    const latest: TestNetwork[] = []

    const result = reconcileNetworks(previous, latest)

    expect(result).toEqual({
      removed: ['ethereum', 'optimism'],
      updated: [],
    })
  })
})
