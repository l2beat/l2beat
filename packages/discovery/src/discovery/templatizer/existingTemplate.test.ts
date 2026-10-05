import { expect } from 'earl'
import { StructureContract } from '../config/StructureConfig'
import {
  type ExistingTemplate,
  failureNote,
  misfitOf,
  remainingWorklist,
} from './existingTemplate'
import { loadFixture } from './test/fixtures'
import { buildWorklist } from './worklist'

describe(remainingWorklist.name, () => {
  const facts = loadFixture('ScrollChain')
  const worklist = buildWorklist(facts.abi, facts.baseline)

  function existing(
    template: Record<string, unknown>,
    failing: ExistingTemplate['failing'] = [],
  ): ExistingTemplate {
    const parsed = StructureContract.parse(template)
    return {
      templateId: 'scroll/ScrollChain',
      template: parsed,
      fields: Object.keys(parsed.fields),
      failing,
    }
  }

  it('leaves out what the fields read and what the template ignores, failing fields included', () => {
    const remaining = remainingWorklist(
      worklist,
      existing(
        {
          ignoreMethods: ['committedBatches', 'withdrawRoots'],
          fields: {
            sequencers: {
              handler: {
                type: 'event',
                select: 'account',
                add: {
                  event: 'UpdateSequencer',
                  where: ['=', '#status', true],
                },
              },
            },
            lastFinalized: {
              handler: { type: 'call', method: 'isBatchFinalized', args: [1] },
            },
          },
        },
        [{ name: 'lastFinalized', error: 'Execution reverted' }],
      ),
    )

    expect(remaining.items.map((item) => item.signature)).toEqual([
      'finalizedStateRoots(uint256)',
      'isProver(address)',
      'isSequencer(address)',
    ])
    expect(remaining.events.map((event) => event.name)).not.toInclude(
      'UpdateSequencer',
    )
    expect(remaining.events.map((event) => event.name)).toInclude(
      'UpdateProver',
      'RevertBatch',
    )
  })

  it('leaves out the constructor when a constructorArgs field reads it', () => {
    const factory = loadFixture('DisputeGameFactory')
    const full = buildWorklist(factory.abi, factory.baseline)
    expect(full.constructorItem?.signature).toEqual('constructor(address)')

    const remaining = remainingWorklist(
      full,
      existing({
        fields: {
          constructorArgs: {
            handler: { type: 'constructorArgs', nameArgs: true },
          },
        },
      }),
    )

    expect(remaining.constructorItem).toEqual(undefined)
    expect(remaining.items).toEqual(full.items)
    expect(remaining.events).toEqual(full.events)
  })

  it('is the whole worklist for a template whose fields read nothing of it', () => {
    const remaining = remainingWorklist(
      worklist,
      existing({ fields: { owner: { severity: 'HIGH' } } }),
    )

    expect(remaining).toEqual(worklist)
  })
})

describe(failureNote.name, () => {
  it('names the block and the error', () => {
    expect(
      failureNote(100, { name: 'x', error: 'Execution reverted' }),
    ).toEqual('review: fails at block 100: Execution reverted')
  })
})

describe(misfitOf.name, () => {
  const existing = (
    failing: ExistingTemplate['failing'],
  ): ExistingTemplate => ({
    templateId: 'proj/Registry',
    template: StructureContract.parse({}),
    fields: [],
    failing,
  })
  const previous = {
    templateId: 'proj/Registry',
    names: ['Registry'],
    failingFields: ['legacy'],
  }

  it('fits when the name is the same and no field that ran on the old code fails', () => {
    expect(misfitOf(existing([]), previous, ['Registry'])).toEqual(undefined)
    expect(
      misfitOf(
        existing([{ name: 'legacy', error: 'Execution reverted' }]),
        previous,
        ['Registry'],
      ),
    ).toEqual(undefined)
  })

  it('names every reason it no longer fits', () => {
    expect(
      misfitOf(
        existing([{ name: 'threshold', error: 'Execution reverted' }]),
        previous,
        ['RegistryV2'],
      ),
    ).toEqual(
      'the contract was Registry and is now RegistryV2; threshold fails on the new code: Execution reverted',
    )
  })

  it('compares the names of several implementations in any order, and skips names it was not given', () => {
    const twoImplementations = {
      ...previous,
      names: ['RollupAdminLogic', 'RollupUserLogic'],
    }
    expect(
      misfitOf(existing([]), twoImplementations, [
        'RollupUserLogic',
        'RollupAdminLogic',
      ]),
    ).toEqual(undefined)
    expect(
      misfitOf(existing([]), { ...previous, names: undefined }, ['Other']),
    ).toEqual(undefined)
  })
})
