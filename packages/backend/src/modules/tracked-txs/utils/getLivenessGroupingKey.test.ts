import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { getLivenessGroupingKey } from './getLivenessGroupingKey'

describe(getLivenessGroupingKey.name, () => {
  const signature =
    'function submit((uint256 start,uint256 end,address prover))' as const
  const iface = new utils.Interface([signature])
  const input = iface.encodeFunctionData('submit', [
    [123, 456, EthereumAddress.random()],
  ])
  const config = {
    formula: 'functionCall' as const,
    address: EthereumAddress.random(),
    selector: iface.getSighash('submit'),
    signature,
  }

  it('extracts a nested scalar parameter', () => {
    const result = getLivenessGroupingKey(input, config, {
      type: 'functionCallParameter',
      path: [0, 0],
    })

    expect(result).toEqual('123')
  })

  it('rejects a path ending at a tuple', () => {
    expect(() =>
      getLivenessGroupingKey(input, config, {
        type: 'functionCallParameter',
        path: [0],
      }),
    ).toThrow('Grouping parameter must be a scalar')
  })

  it('rejects a missing parameter', () => {
    expect(() =>
      getLivenessGroupingKey(input, config, {
        type: 'functionCallParameter',
        path: [0, 3],
      }),
    ).toThrow('Parameter path does not exist')
  })
})
