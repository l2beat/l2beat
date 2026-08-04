import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type {
  FunctionCallConfiguration,
  SharedBridgeConfiguration,
} from './prepareFunctionCalls'
import { prepareFunctionCalls } from './prepareFunctionCalls'

const ADDRESS = EthereumAddress.random()
const SELECTOR = '0x12345678'
const TIMESTAMP = UnixTime.fromDate(new Date('2026-08-04T00:00:00Z'))

describe(prepareFunctionCalls.name, () => {
  it('compiles grouping metadata once for the query and transformer', () => {
    const grouped = functionCall('grouped', [0, 0])

    const plan = prepareFunctionCalls([grouped], [], [])
    const projection = plan.groupingProjections.get(grouped.id)

    expect(plan.queryTargets).toEqual([
      {
        address: ADDRESS,
        selector: SELECTOR,
        input: 'selector',
        groupingProjection: {
          start: 5,
          length: 32,
          abiType: 'uint256',
        },
      },
    ])
    expect(plan.queryTargets[0]?.groupingProjection === projection).toEqual(
      true,
    )
  })

  it('normalizes duplicate consumers and lets full input win', () => {
    const grouped = functionCall('grouped', [0, 0])
    const fullInput = sharedBridge('shared-bridge')

    const plan = prepareFunctionCalls([grouped, grouped], [], [fullInput])

    expect(plan.queryTargets).toEqual([
      {
        address: ADDRESS,
        selector: SELECTOR,
        input: 'full',
        groupingProjection: {
          start: 5,
          length: 32,
          abiType: 'uint256',
        },
      },
    ])
  })

  it('rejects conflicting projections for the same call', () => {
    expect(() =>
      prepareFunctionCalls(
        [functionCall('first', [0, 0]), functionCall('second', [0, 1])],
        [],
        [],
      ),
    ).toThrow('Conflicting grouping projections for the same function call')
  })
})

function functionCall(
  id: string,
  path: readonly [number, ...number[]],
): FunctionCallConfiguration {
  return {
    id,
    minHeight: TIMESTAMP,
    maxHeight: null,
    properties: {
      id,
      projectId: ProjectId('project'),
      type: 'liveness',
      subtype: 'stateUpdates',
      sinceTimestamp: TIMESTAMP,
      groupBy: { type: 'functionCallParameter', path },
      params: {
        formula: 'functionCall',
        address: ADDRESS,
        selector: SELECTOR,
        signature: 'function submit((uint256,uint256))',
      },
    },
  }
}

function sharedBridge(id: string): SharedBridgeConfiguration {
  return {
    id,
    minHeight: TIMESTAMP,
    maxHeight: null,
    properties: {
      id,
      projectId: ProjectId('project'),
      type: 'liveness',
      subtype: 'stateUpdates',
      sinceTimestamp: TIMESTAMP,
      params: {
        formula: 'sharedBridge',
        address: ADDRESS,
        selector: SELECTOR,
        signature: 'function submit(uint256)',
        firstParameter: 1,
      },
    },
  }
}
