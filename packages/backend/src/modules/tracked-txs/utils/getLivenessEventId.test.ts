import type { TrackedTxLivenessConfig } from '@l2beat/shared'
import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { getLivenessEventId } from './getLivenessEventId'

describe(getLivenessEventId.name, () => {
  const signature = 'function submit((uint256,uint256))' as const
  const iface = new utils.Interface([signature])
  const input = iface.encodeFunctionData('submit', [[123, 456]])

  it('uses the transaction hash by default', () => {
    expect(
      getLivenessEventId(transactionHashConfig(), { hash: '0x123' }),
    ).toEqual('0x123')
  })

  it('extracts a nested function parameter', () => {
    expect(
      getLivenessEventId(functionParameterConfig([0, 0]), {
        hash: '0x123',
        input,
      }),
    ).toEqual('123')
  })

  it('rejects paths ending at a tuple', () => {
    expect(() =>
      getLivenessEventId(functionParameterConfig([0]), {
        hash: '0x123',
        input,
      }),
    ).toThrow('Event identity parameter must be a scalar')
  })

  function transactionHashConfig(): TrackedTxLivenessConfig {
    return {
      ...baseConfig(),
      eventIdentity: { type: 'transactionHash' },
      params: {
        formula: 'transfer',
        to: EthereumAddress.random(),
      },
    }
  }

  function functionParameterConfig(
    path: readonly [number, ...number[]],
  ): TrackedTxLivenessConfig {
    return {
      ...baseConfig(),
      eventIdentity: { type: 'functionCallParameter', path },
      params: {
        formula: 'functionCall',
        address: EthereumAddress.random(),
        selector: input.slice(0, 10),
        signature,
      },
    }
  }

  function baseConfig() {
    return {
      id: 'config-id',
      projectId: ProjectId('project-id'),
      sinceTimestamp: 0,
      subtype: 'stateUpdates' as const,
      type: 'liveness' as const,
    }
  }
})
