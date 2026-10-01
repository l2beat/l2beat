import { expect } from 'earl'
import { buildBaseline } from './baseline'

describe(buildBaseline.name, () => {
  const abi = [
    'function owner() view returns (address)',
    'function paused() view returns (bool)',
    'function validatorAt(uint256 index) view returns (address)',
    'function balanceOf(address who) view returns (uint256)',
    'function $weird() view returns (uint256)',
  ]

  it('keeps the system handlers’ values and errors under their V1 names and kinds', () => {
    const baseline = buildBaseline(
      abi,
      [],
      {
        owner: 'eth:0x1111111111111111111111111111111111111111',
        validatorAt: ['eth:0x2222222222222222222222222222222222222222'],
        _$weird: 1,
        myOverrideField: 'set by a project override',
      },
      { paused: 'Execution reverted' },
    )

    expect(baseline).toEqual({
      fields: {
        _$weird: { kind: 'getter', value: 1 },
        owner: {
          kind: 'getter',
          value: 'eth:0x1111111111111111111111111111111111111111',
        },
        paused: { kind: 'getter', error: 'Execution reverted' },
        validatorAt: {
          kind: 'probe',
          value: ['eth:0x2222222222222222222222222222222222222222'],
        },
      },
    })
  })

  it('leaves out ignored methods, as V1 does not read them', () => {
    const baseline = buildBaseline(
      abi,
      ['owner'],
      { owner: 'eth:0x1111111111111111111111111111111111111111' },
      {},
    )

    expect(baseline.fields).toEqual({})
  })

  it('names a field after the 0-argument getter when a probe shares its name', () => {
    const baseline = buildBaseline(
      [
        'function owners(uint256) view returns (address)',
        'function owners() view returns (address[])',
      ],
      [],
      { owners: [] },
      {},
    )

    expect(baseline.fields.owners?.kind).toEqual('getter')
  })
})
