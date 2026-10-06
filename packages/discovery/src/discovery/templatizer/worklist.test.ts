import { expect } from 'earl'
import type { Baseline } from './facts'
import { loadFixture } from './test/fixtures'
import { buildWorklist, isEmptyWorklist } from './worklist'

describe(buildWorklist.name, () => {
  const NO_BASELINE: Baseline = { fields: {} }

  it('lists parametrized views and every event of a real contract, sorted', () => {
    const facts = loadFixture('ScrollChain')
    const worklist = buildWorklist(facts.abi, facts.baseline)

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
    expect(worklist.items.map((item) => item.signature)).toInclude(
      'isSequencer(address)',
    )
  })

  it('marks as probed the items the baseline says V1 probed, under V1’s field name, and only the single-uint256 overload', () => {
    const worklist = buildWorklist(
      [
        'function validatorAt(uint256 index) view returns (address)',
        'function validatorAt(address who) view returns (uint256)',
        'function $ignored(uint256 index) view returns (address)',
        'function validators(address) view returns (bool)',
        'function thresholds(uint8, uint256) view returns (uint256)',
      ],
      {
        fields: {
          validatorAt: { kind: 'probe', value: [] },
          _$ignored: { kind: 'probe', value: [] },
        },
      },
    )

    expect(worklist.items.map((item) => [item.signature, item.probed])).toEqual(
      [
        ['$ignored(uint256)', true],
        ['thresholds(uint8,uint256)', false],
        ['validatorAt(address)', false],
        ['validatorAt(uint256)', true],
        ['validators(address)', false],
      ],
    )
  })

  it('does not call an item probed when V1 did not probe it (ignored, or shadowed by a getter of that name)', () => {
    const worklist = buildWorklist(
      [
        'function owners(uint256) view returns (address)',
        'function owners() view returns (address[])',
        'function ignored(uint256) view returns (address)',
      ],
      { fields: { owners: { kind: 'getter', value: [] } } },
    )

    expect(worklist.items.map((item) => [item.signature, item.probed])).toEqual(
      [
        ['ignored(uint256)', false],
        ['owners(uint256)', false],
      ],
    )
  })

  it('leaves out 0-argument getters, state-changing functions and functions returning nothing', () => {
    const worklist = buildWorklist(
      [
        'function owner() view returns (address)',
        'function setOwner(address owner)',
        'function check(address who) view',
      ],
      NO_BASELINE,
    )

    expect(worklist.items).toEqual([])
    expect(isEmptyWorklist(worklist)).toEqual(true)
  })

  it('lists a constructor with parameters by its minimal signature, the first of a merged ABI, as V1 decodes with', () => {
    const worklist = buildWorklist(
      [
        'constructor(address _logic, address admin_, bytes _data) payable',
        'constructor(address _owner)',
        'function owner() view returns (address)',
      ],
      NO_BASELINE,
    )

    expect(worklist.constructorItem).toEqual({
      signature: 'constructor(address,address,bytes)',
      fragment:
        'constructor(address _logic, address admin_, bytes _data) payable',
      inputs: [
        { name: '_logic', type: 'address' },
        { name: 'admin_', type: 'address' },
        { name: '_data', type: 'bytes' },
      ],
    })
    expect(worklist.items).toEqual([])
    expect(worklist.events).toEqual([])
    expect(isEmptyWorklist(worklist)).toEqual(false)
  })

  it('leaves out a constructor without parameters, which has nothing to decode', () => {
    const worklist = buildWorklist(
      ['constructor()', 'function owner() view returns (address)'],
      NO_BASELINE,
    )

    expect(worklist.constructorItem).toEqual(undefined)
    expect(isEmptyWorklist(worklist)).toEqual(true)
  })

  it('rules on an overloaded event once, by name, because V1 resolves events by name', () => {
    const worklist = buildWorklist(
      [
        'event Updated(address who)',
        'event Updated(address who, uint256 value)',
      ],
      NO_BASELINE,
    )

    expect(worklist.events.map((event) => event.name)).toEqual(['Updated'])
    expect(isEmptyWorklist(worklist)).toEqual(false)
  })

  it('is identical for the same ABI in any order', () => {
    const facts = loadFixture('SequencerInbox')

    expect(buildWorklist([...facts.abi].reverse(), facts.baseline)).toEqual(
      buildWorklist(facts.abi, facts.baseline),
    )
  })
})
