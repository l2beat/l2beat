import { expect, mockObject } from 'earl'
import type { Field, Node } from '../State'
import {
  fieldPathPrefixes,
  getRowLayout,
  ROW_FAN_SPREAD,
  reconcileCompressedRows,
  resolveRowKey,
} from './rows'

describe(fieldPathPrefixes.name, () => {
  it('yields every enclosing group, shortest first', () => {
    expect(fieldPathPrefixes('foo.bar[1].baz')).toEqual([
      'foo',
      'foo.bar',
      'foo.bar[1]',
      'foo.bar[1].baz',
    ])
    expect(fieldPathPrefixes('$members[0]')).toEqual([
      '$members',
      '$members[0]',
    ])
    expect(fieldPathPrefixes('owner')).toEqual(['owner'])
  })
})

describe(resolveRowKey.name, () => {
  it('keeps a value on its own row when nothing encloses it', () => {
    expect(resolveRowKey('$members[0]', new Set(['other']))).toEqual(
      '$members[0]',
    )
  })

  it('lets the outermost compression win over a nested one', () => {
    expect(resolveRowKey('foo.bar[1]', new Set(['foo', 'foo.bar']))).toEqual(
      'foo',
    )
  })
})

describe(getRowLayout.name, () => {
  it('gives every value its own row by default', () => {
    const layout = getRowLayout(
      makeNode(['$threshold', '$members[0]', '$members[1]']),
    )

    expect(layout.rows.map((row) => row.label)).toEqual([
      '$threshold',
      '$members[0]',
      '$members[1]',
    ])
    expect(layout.rowByField).toEqual([0, 1, 2])
  })

  it('draws a compressed group as one counted row that keeps every value', () => {
    const layout = getRowLayout(
      makeNode(
        ['$threshold', '$members[0]', '$members[1]', '$members[2]'],
        [],
        ['$members'],
      ),
    )

    expect(layout.rows.length).toEqual(2)
    expect(layout.rows[1]?.label).toEqual('$members (3)')
    expect(layout.rows[1]?.fieldIndices).toEqual([1, 2, 3])
    expect(layout.rowByField).toEqual([0, 1, 1, 1])
  })

  it('counts only the values a compressed row still links to', () => {
    const layout = getRowLayout(
      makeNode(
        ['owner', '$members[0]', '$members[1]'],
        ['$members[1]'],
        ['$members'],
      ),
    )

    expect(layout.rows.map((row) => row.label)).toEqual([
      'owner',
      '$members (1)',
    ])
    // A hidden value keeps the geometry of the row that follows it.
    expect(layout.rowByField).toEqual([0, 1, 2])

    const allHidden = getRowLayout(
      makeNode(['owner', '$members[0]'], ['$members[0]'], ['$members']),
    )
    expect(allHidden.rows.map((row) => row.label)).toEqual(['owner'])
  })

  it('prefers a field label over its path, the way group rows are named', () => {
    const node = makeNode(['group-field:target'])
    const labelled = mockObject<Node>({
      ...node,
      fields: [{ ...(node.fields[0] as Field), label: 'Member' }],
    })

    expect(getRowLayout(labelled).rows[0]?.label).toEqual('Member')
  })

  it('anchors a lone value at its row centre and fans a compressed row', () => {
    expect(getRowLayout(makeNode(['owner'])).anchorByField).toEqual([0])

    const layout = getRowLayout(
      makeNode(['$members[0]', '$members[1]', '$members[2]'], [], ['$members']),
    )

    expect(layout.anchorByField).toEqual([
      (0.25 - 0.5) * ROW_FAN_SPREAD,
      0,
      (0.75 - 0.5) * ROW_FAN_SPREAD,
    ])
  })
})

describe(reconcileCompressedRows.name, () => {
  it('drops paths that no longer group any value', () => {
    const fields = [{ name: '$members[0]' }, { name: 'owner' }]

    expect(
      reconcileCompressedRows(fields, ['$members', 'gone', 'gone.deeper']),
    ).toEqual(['$members'])
  })
})

function makeNode(
  names: string[],
  hiddenFields: string[] = [],
  compressedRows: string[] = [],
): Node {
  return mockObject<Node>({
    fields: names.map((name) =>
      mockObject<Field>({ name, target: '0x0', label: undefined }),
    ),
    hiddenFields,
    compressedRows,
  })
}
