import type { DiscoveryDiff } from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { filterDiff } from './filterDiff'

const ADDRESS_A = EthereumAddress.random()
const ADDRESS_B = EthereumAddress.random()

describe(filterDiff.name, () => {
  it('unknownContracts', () => {
    const diff: DiscoveryDiff[] = [
      { name: 'A', address: ADDRESS_A, diff: [{ key: 'A', after: '1' }] },
      { name: 'B', address: ADDRESS_B, diff: [{ key: 'B', after: '1' }] },
    ]
    const unknownContracts = [ADDRESS_B]

    const result = filterDiff(diff, unknownContracts)

    expect(result).toEqual([
      { name: 'A', address: ADDRESS_A, diff: [{ key: 'A', after: '1' }] },
    ])
  })
  it('created', () => {
    const diff: DiscoveryDiff[] = [
      { name: 'A', address: ADDRESS_A, type: 'created' },
    ]

    const result = filterDiff(diff, [])

    expect(result).toEqual([])
  })
  it('deleted', () => {
    const diff: DiscoveryDiff[] = [
      { name: 'A', address: ADDRESS_A, type: 'deleted' },
    ]

    const result = filterDiff(diff, [])

    expect(result).toEqual([])
  })
  it('errors', () => {
    const diff: DiscoveryDiff[] = [
      {
        name: 'A',
        address: ADDRESS_A,
        diff: [{ key: 'errors', after: 'Error' }],
      },
    ]

    const result = filterDiff(diff, [])

    expect(result).toEqual([])
  })
})
