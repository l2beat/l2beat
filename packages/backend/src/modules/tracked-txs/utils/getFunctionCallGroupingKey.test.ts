import type { TrackedTxFunctionCallConfig } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { getFunctionCallGroupingKey } from './getFunctionCallGroupingKey'

describe(getFunctionCallGroupingKey.name, () => {
  const signature = 'function submit((uint256,uint256))' as const
  const iface = new utils.Interface([signature])
  const input = iface.encodeFunctionData('submit', [[123, 456]])

  it('extracts a nested function parameter', () => {
    const config: TrackedTxFunctionCallConfig = {
      formula: 'functionCall',
      address: EthereumAddress.ZERO,
      selector: input.slice(0, 10),
      signature,
      deduplicateBy: { type: 'functionCallParameter', path: [0, 0] },
    }

    expect(getFunctionCallGroupingKey(input, config)).toEqual('123')
  })

  it('returns undefined without a deduplication configuration', () => {
    const config: TrackedTxFunctionCallConfig = {
      formula: 'functionCall',
      address: EthereumAddress.ZERO,
      selector: input.slice(0, 10),
      signature,
    }

    expect(getFunctionCallGroupingKey(input, config)).toEqual(undefined)
  })

  it('rejects paths ending at a tuple', () => {
    const config: TrackedTxFunctionCallConfig = {
      formula: 'functionCall',
      address: EthereumAddress.ZERO,
      selector: input.slice(0, 10),
      signature,
      deduplicateBy: { type: 'functionCallParameter', path: [0] },
    }

    expect(() => getFunctionCallGroupingKey(input, config)).toThrow(
      'Grouping parameter must be a scalar',
    )
  })
})
