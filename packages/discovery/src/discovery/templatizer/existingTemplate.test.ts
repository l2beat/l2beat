import { expect } from 'earl'
import { StructureContract } from '../config/StructureConfig'
import { type ExistingTemplate, misfitOf } from './existingTemplate'

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
