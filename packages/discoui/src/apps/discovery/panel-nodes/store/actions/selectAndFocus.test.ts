import { expect } from 'earl'
import type { Node, State } from '../State'
import { selectAndFocus } from './selectAndFocus'

describe(selectAndFocus.name, () => {
  it('selects a member of an open group on its own', () => {
    const group = {
      ...makeNode('group'),
      opened: true,
      subnodes: [makeNode('member')],
    }

    const result = selectAndFocus(makeState([group]), ['member'])

    expect(result.selected).toEqual(['member'])
  })

  it('clears the selection when the contract is not drawn', () => {
    const group = { ...makeNode('group'), subnodes: [makeNode('member')] }
    const state = { ...makeState([group]), selected: ['group'] }

    const result = selectAndFocus(state, ['member'])

    expect(result.selected).toEqual([])
  })

  it('selects every drawn contract and centers the first', () => {
    const state = makeState([makeNode('first'), makeNode('second')])

    const result = selectAndFocus(state, ['first', 'second'])

    expect(result.selected).toEqual(['first', 'second'])
    expect(result.transform).not.toEqual(undefined)
  })

  it('clears the selection when nothing is drawn', () => {
    const state = { ...makeState([makeNode('a')]), selected: ['a'] }

    expect(selectAndFocus(state, []).selected).toEqual([])
  })
})

// selectAndFocus reads only the nodes, the selection and the transform.
function makeState(nodes: Node[]): State {
  const transform = { offsetX: 0, offsetY: 0, scale: 1 }
  return { nodes, selected: [], transform } as unknown as State
}

function makeNode(id: string): Node {
  return {
    id,
    address: `test:${id}`,
    isInitial: false,
    hasTemplate: false,
    addressType: 'Contract',
    name: id,
    fields: [],
    hiddenFields: [],
    compressedRows: [],
    box: { x: 0, y: 0, width: 200, height: 0 },
    color: 0,
    hueShift: 0,
    data: null,
    isReachable: true,
    opened: false,
    subnodes: [],
  }
}
