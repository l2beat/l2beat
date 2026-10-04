import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { StructureContract } from '../config/StructureConfig'
import { makeEntryStructureConfig } from '../config/structureUtils'
import { getHandlers } from '../handlers/getHandlers'
import { buildBaseline } from './baseline'

describe(buildBaseline.name, () => {
  const ADDRESS = ChainSpecificAddress(
    'eth:0x1111111111111111111111111111111111111111',
  )
  const abi = [
    'function owner() view returns (address)',
    'function paused() view returns (bool)',
    'function validatorAt(uint256 index) view returns (address)',
    'function balanceOf(address who) view returns (uint256)',
    'function $weird() view returns (uint256)',
  ]

  function handlersFor(override: Record<string, unknown> = {}) {
    return getHandlers(
      abi,
      makeEntryStructureConfig(
        {
          overrides: {
            [ADDRESS.toString()]: StructureContract.parse(override),
          },
        },
        ADDRESS,
      ),
    )
  }

  it('keeps every value and error of the untemplatized run, with the kind V1’s handler list gives its name', () => {
    const baseline = buildBaseline(
      {
        owner: 'eth:0x1111111111111111111111111111111111111111',
        validatorAt: ['eth:0x2222222222222222222222222222222222222222'],
        _$weird: 1,
        fromConfig: 'set by a project override',
      },
      { paused: 'Execution reverted' },
      handlersFor({
        fields: { fromConfig: { handler: { type: 'hardcoded', value: 'x' } } },
      }),
    )

    expect(baseline).toEqual({
      fields: {
        _$weird: { kind: 'getter', value: 1 },
        fromConfig: { kind: 'override', value: 'set by a project override' },
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

  it('treats a value no handler produced (a copy field of the override) as an override field', () => {
    const baseline = buildBaseline(
      {
        owner: 'eth:0x1111111111111111111111111111111111111111',
        ownerCopy: 'x',
      },
      {},
      handlersFor({ fields: { ownerCopy: { copy: 'owner' } } }),
    )

    expect(baseline.fields.ownerCopy).toEqual({ kind: 'override', value: 'x' })
  })

  it('marks a probe the override shadows as the override’s', () => {
    const baseline = buildBaseline(
      { validatorAt: ['eth:0x2222222222222222222222222222222222222222'] },
      {},
      handlersFor({
        fields: {
          validatorAt: { handler: { type: 'array', method: 'validatorAt' } },
        },
      }),
    )

    expect(baseline.fields.validatorAt?.kind).toEqual('override')
  })

  it('names a field after the 0-argument getter when a probe shares its name, as V1 does', () => {
    const owners = [
      'function owners(uint256) view returns (address)',
      'function owners() view returns (address[])',
    ]
    const baseline = buildBaseline(
      { owners: [] },
      {},
      getHandlers(owners, makeEntryStructureConfig({}, ADDRESS)),
    )

    expect(baseline.fields.owners?.kind).toEqual('getter')
  })
})
