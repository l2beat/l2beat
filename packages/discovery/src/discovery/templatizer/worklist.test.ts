import { expect } from 'earl'
import { loadFixture } from './test/fixtures'
import { buildWorklist, isEmptyWorklist, worklistTokens } from './worklist'

describe(buildWorklist.name, () => {
  it('lists parametrized views and every event of a real contract, sorted', () => {
    const worklist = buildWorklist(loadFixture('ScrollChain').abi)

    expect(worklist.items.map((item) => item.signature)).toEqual([
      'committedBatches(uint256)',
      'finalizedStateRoots(uint256)',
      'isBatchFinalized(uint256)',
      'isProver(address)',
      'isSequencer(address)',
      'withdrawRoots(uint256)',
    ])
    expect(worklist.events.map((event) => event.name)).toInclude(
      'RevertBatch',
      'UpdateSequencer',
      'UpdateProver',
      'CommitBatch',
    )
    expect(worklistTokens(worklist)).toInclude(
      'isSequencer(address)',
      'RevertBatch',
    )
  })

  it('marks the single-uint256 getters V1 probes at indices 0–4', () => {
    const worklist = buildWorklist([
      'function validatorAt(uint256 index) view returns (address)',
      'function validators(address) view returns (bool)',
      'function thresholds(uint8, uint256) view returns (uint256)',
    ])

    expect(worklist.items.map((item) => [item.signature, item.probed])).toEqual(
      [
        ['thresholds(uint8,uint256)', false],
        ['validatorAt(uint256)', true],
        ['validators(address)', false],
      ],
    )
  })

  it('leaves out 0-argument getters, state-changing functions and functions returning nothing', () => {
    const worklist = buildWorklist([
      'function owner() view returns (address)',
      'function setOwner(address owner)',
      'function check(address who) view',
    ])

    expect(worklist.items).toEqual([])
    expect(isEmptyWorklist(worklist)).toEqual(true)
  })

  it('rules on an overloaded event once, by name, because V1 resolves events by name', () => {
    const worklist = buildWorklist([
      'event Updated(address who)',
      'event Updated(address who, uint256 value)',
    ])

    expect(worklist.events.map((event) => event.name)).toEqual(['Updated'])
    expect(isEmptyWorklist(worklist)).toEqual(false)
  })

  it('is identical for the same ABI in any order', () => {
    const abi = loadFixture('SequencerInbox').abi

    expect(buildWorklist([...abi].reverse())).toEqual(buildWorklist(abi))
  })
})
