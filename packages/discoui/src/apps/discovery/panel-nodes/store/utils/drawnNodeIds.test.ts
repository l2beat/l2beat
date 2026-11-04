import { expect } from 'earl'
import type { Node } from '../State'
import { drawnNodeIds } from './drawnNodeIds'

describe(drawnNodeIds.name, () => {
  const bridge = makeNode('eth:0xbridge')
  const admin = makeNode('eth:0xadmin')
  const council = makeNode('eth:0xcouncil')

  it('selects a contract the graph draws on its own', () => {
    expect(drawnNodeIds([bridge, admin], ['eth:0xadmin'])).toEqual([
      'eth:0xadmin',
    ])
  })

  it('selects a closed group for its members, once', () => {
    const group = makeNode('group', { subnodes: [admin, council] })
    expect(
      drawnNodeIds([bridge, group], ['eth:0xcouncil', 'eth:0xadmin']),
    ).toEqual(['group'])
  })

  it('selects a member of an opened group on its own', () => {
    const group = makeNode('group', { opened: true, subnodes: [admin] })
    expect(drawnNodeIds([bridge, group], ['eth:0xadmin'])).toEqual([
      'eth:0xadmin',
    ])
  })

  it('keeps the order of the step and skips what is not drawn', () => {
    expect(
      drawnNodeIds([bridge, admin], ['eth:0xadmin', 'eth:0xnope', bridge.id]),
    ).toEqual(['eth:0xadmin', 'eth:0xbridge'])
  })
})

function makeNode(id: string, overrides: Partial<Node> = {}): Node {
  return {
    id,
    address: id,
    isInitial: true,
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
    ...overrides,
  }
}
