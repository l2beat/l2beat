import { expect, mockObject } from 'earl'
import type { Field } from '../../store/State'
import { buildFieldTree } from './buildFieldTree'

describe(buildFieldTree.name, () => {
  it('simple fields', () => {
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

  it('nested fields with simple fields', () => {
    const fields = [
      field({ name: 'a.b' }),
      field({ name: 'a.e' }),
      field({ name: 'c.d' }),
    ]
    const tree = buildFieldTree(fields)
    expect(tree).toEqual([
      {
        type: 'complex',
        property: 'a',
        value: [
          { type: 'simple', property: 'b', fullKey: 'a.b' },
          { type: 'simple', property: 'e', fullKey: 'a.e' },
        ],
      },
      {
        type: 'complex',
        property: 'c',
        value: [{ type: 'simple', property: 'd', fullKey: 'c.d' }],
      },
    ])
  })

  it('top-level arrays', () => {
    const fields = [
      field({ name: 'a[0]' }),
      field({ name: 'a[1]' }),
      field({ name: 'a[2]' }),
    ]
    const tree = buildFieldTree(fields)
    expect(tree).toEqual([
      {
        type: 'complex',
        property: 'a',
        value: [
          { type: 'simple', property: '0', fullKey: 'a[0]' },
          { type: 'simple', property: '1', fullKey: 'a[1]' },
          { type: 'simple', property: '2', fullKey: 'a[2]' },
        ],
      },
    ])
  })

  it('nested arrays', () => {
    const fields = [
      field({ name: 'a[0][0]' }),
      field({ name: 'a[0][1]' }),
      field({ name: 'a[1][0]' }),
      field({ name: 'a[1][1]' }),
    ]
    const tree = buildFieldTree(fields)
    expect(tree).toEqual([
      {
        type: 'complex',
        property: 'a',
        value: [
          {
            type: 'complex',
            property: '0',
            value: [
              { type: 'simple', property: '0', fullKey: 'a[0][0]' },
              { type: 'simple', property: '1', fullKey: 'a[0][1]' },
            ],
          },
          {
            type: 'complex',
            property: '1',
            value: [
              { type: 'simple', property: '0', fullKey: 'a[1][0]' },
              { type: 'simple', property: '1', fullKey: 'a[1][1]' },
            ],
          },
        ],
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
