import { expect } from 'earl'
import type { Node } from '../panel-nodes/store/State'
import { describeGraph } from './graphState'

describe(describeGraph.name, () => {
  it('lists every contract with its innermost group and whether it is hidden', () => {
    const council = node('council', 'Council', [])
    const admin = node('admin', 'Admin', ['council'])
    const group = {
      ...node('group:1', 'Control', []),
      subnodes: [
        { ...node('group:2', 'Inner', []), subnodes: [council] },
        admin,
      ],
    }
    const root = {
      ...node('root', 'Root', ['admin', 'oracle'], true),
      hiddenFields: ['field1'],
    }
    expect(describeGraph([root, group, node('oracle', 'Oracle', [])])).toEqual([
      {
        address: 'admin',
        name: 'Admin',
        hidden: false,
        group: 'Control',
        color: 0,
      },
      {
        address: 'council',
        name: 'Council',
        hidden: false,
        group: 'Inner',
        color: 0,
      },
      {
        address: 'oracle',
        name: 'Oracle',
        hidden: true,
        group: undefined,
        color: 0,
      },
      {
        address: 'root',
        name: 'Root',
        hidden: false,
        group: undefined,
        color: 0,
      },
    ])
  })
})

function node(
  id: string,
  name: string,
  targets: string[],
  isInitial = false,
): Node {
  return {
    id,
    address: id,
    isInitial,
    hasTemplate: false,
    addressType: 'Contract',
    name,
    fields: targets.map((target, i) => ({
      name: `field${i}`,
      target,
      box: { x: 0, y: 0, width: 0, height: 0 },
      connection: {
        from: { direction: 'left', x: 0, y: 0 },
        to: { direction: 'left', x: 0, y: 0 },
      },
    })),
    hiddenFields: [],
    compressedRows: [],
    box: { x: 0, y: 0, width: 200, height: 50 },
    color: 0,
    hueShift: 0,
    data: null,
    isReachable: true,
    opened: false,
    subnodes: [],
  }
}
