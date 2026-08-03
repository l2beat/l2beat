import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { getFunctionCallParameterProjection } from './getFunctionCallParameterProjection'
import {
  getLivenessGroupingKey,
  getLivenessGroupingKeyFromProjectedValue,
} from './getLivenessGroupingKey'

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

  it('derives the same key from a projected ABI word', () => {
    const fromFullInput = getLivenessGroupingKey(input, config, {
      type: 'functionCallParameter',
      path: [0, 0],
    })
    const projectedWord = utils.hexDataSlice(input, 4, 36)

    const fromProjection = getLivenessGroupingKeyFromProjectedValue(
      projectedWord,
      'uint256',
    )

    expect(fromProjection).toEqual(fromFullInput)
  })

  it('derives the same key from an Aztec-shaped dynamic tuple', () => {
    const signature = 'function submit((uint256 start,bytes proof))' as const
    const iface = new utils.Interface([signature])
    const input = iface.encodeFunctionData('submit', [[3967, '0x1234']])
    const config = {
      formula: 'functionCall' as const,
      address: EthereumAddress.random(),
      selector: iface.getSighash('submit'),
      signature,
    }
    const grouping = {
      type: 'functionCallParameter' as const,
      path: [0, 0] as const,
    }
    const projection = getFunctionCallParameterProjection(
      signature,
      grouping.path,
    )
    const projectedWord = utils.hexDataSlice(
      input,
      projection.start - 1,
      projection.start - 1 + projection.length,
    )

    const fromFullInput = getLivenessGroupingKey(input, config, grouping)
    const fromProjection = getLivenessGroupingKeyFromProjectedValue(
      projectedWord,
      projection.abiType,
    )

    expect(projection.start).toEqual(37)
    expect(fromProjection).toEqual(fromFullInput)
    expect(fromProjection).toEqual('3967')
  })

  it('preserves address formatting', () => {
    const fromFullInput = getLivenessGroupingKey(input, config, {
      type: 'functionCallParameter',
      path: [0, 2],
    })
    const projectedWord = utils.hexDataSlice(input, 68, 100)

    const fromProjection = getLivenessGroupingKeyFromProjectedValue(
      projectedWord,
      'address',
    )

    expect(fromProjection).toEqual(fromFullInput)
  })

  it('rejects a projected value that is not one ABI word', () => {
    expect(() =>
      getLivenessGroupingKeyFromProjectedValue('0x1234', 'uint256'),
    ).toThrow('Invalid projected grouping value length')
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
