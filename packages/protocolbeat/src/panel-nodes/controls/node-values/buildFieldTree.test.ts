import { expect, mockObject } from 'earl'
import type { Field } from '../../store/State'
import { buildFieldTree } from './buildFieldTree'

describe(buildFieldTree.name, () => {
  it('should build a field tree', () => {
    const fields = [field({ name: 'a' }), field({ name: 'c' })]
    const tree = buildFieldTree(fields)
    expect(tree).toEqual([
      {
        type: 'simple',
        property: 'a',
        fullKey: 'a',
      },
      {
        type: 'simple',
        property: 'c',
        fullKey: 'c',
      },
    ])
  })
})

function field(f: Partial<Field>): Field {
  return mockObject<Field>({
    target: '0x0',
    name: 'change_me',
    ...f,
  })
}
