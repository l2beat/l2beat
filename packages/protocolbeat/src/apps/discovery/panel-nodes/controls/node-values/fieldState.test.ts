import { expect, mockObject } from 'earl'
import type { Field } from '../../store/State'
import { buildFieldTree, type ExpandedField } from './buildFieldTree'
import {
  getFieldState,
  setFieldState,
  type ValueVisibility,
} from './fieldState'

const TREE = buildFieldTree([
  field('$threshold'),
  field('$members[0]'),
  field('$members[1]'),
  field('modules[0]'),
])
const THRESHOLD = entry(TREE, '$threshold')
const MEMBERS = entry(TREE, '$members')

describe(getFieldState.name, () => {
  it('reads a single value as shown or hidden', () => {
    expect(getFieldState(THRESHOLD, EMPTY)).toEqual('on')
    expect(
      getFieldState(THRESHOLD, { ...EMPTY, hiddenFields: ['$threshold'] }),
    ).toEqual('off')
  })

  it('reads a group as compressed, mixed, or compressed by its parent', () => {
    expect(
      getFieldState(MEMBERS, { ...EMPTY, compressedRows: ['$members'] }),
    ).toEqual('compress')
    expect(
      getFieldState(MEMBERS, { ...EMPTY, hiddenFields: ['$members[0]'] }),
    ).toEqual('mixed')
    expect(getFieldState(member(), EMPTY, '$members')).toEqual('compress')
  })
})

describe(setFieldState.name, () => {
  it('compressing a group records the path and brings its members back', () => {
    const result = setFieldState(
      MEMBERS,
      { hiddenFields: ['$members[1]', '$threshold'], compressedRows: [] },
      'compress',
    )

    expect(result.compressedRows).toEqual(['$members'])
    expect(result.hiddenFields).toEqual(['$threshold'])
  })

  it('expanding or hiding a group stops compressing it', () => {
    const compressed = { hiddenFields: [], compressedRows: ['$members'] }

    expect(setFieldState(MEMBERS, compressed, 'on')).toEqual({
      hiddenFields: [],
      compressedRows: [],
    })
    expect(setFieldState(MEMBERS, compressed, 'off')).toEqual({
      hiddenFields: ['$members[0]', '$members[1]'],
      compressedRows: [],
    })
  })

  it('never records compression a row cannot use', () => {
    // A single value has nothing to compress, and a member of a compressed
    // group is compressed by its parent rather than by itself.
    expect(setFieldState(THRESHOLD, EMPTY, 'compress').compressedRows).toEqual(
      [],
    )
    expect(
      setFieldState(
        member(),
        { hiddenFields: ['$members[0]'], compressedRows: ['$members'] },
        'compress',
        '$members',
      ),
    ).toEqual({ hiddenFields: [], compressedRows: ['$members'] })
  })

  it('keeps the group compressed when one member is hidden through it', () => {
    const result = setFieldState(
      member(),
      { hiddenFields: [], compressedRows: ['$members'] },
      'off',
    )

    expect(result.compressedRows).toEqual(['$members'])
    expect(getFieldState(MEMBERS, result)).toEqual('mixed')
  })
})

const EMPTY: ValueVisibility = { hiddenFields: [], compressedRows: [] }

function field(name: string): Field {
  return mockObject<Field>({ name, target: '0x0', label: undefined })
}

function entry(tree: ExpandedField[], property: string): ExpandedField {
  const found = tree.find((entry) => entry.property === property)
  if (found === undefined) throw new Error(`No tree entry ${property}`)
  return found
}

function member(): ExpandedField {
  if (MEMBERS.type === 'simple') throw new Error('Expected a group')
  return MEMBERS.value[0] as ExpandedField
}
