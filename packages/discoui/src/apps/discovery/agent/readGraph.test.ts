import { expect } from 'earl'
import type { Field, Node, State } from '../panel-nodes/store/State'
import { readGraph } from './readGraph'

// A hand-built node view with a group, a hidden contract and a link inside
// the group; the test reads the answer the tab would send.
describe(readGraph.name, () => {
  const group: Node = {
    ...makeNode('group:admins', 'Admins'),
    addressType: 'Group',
    box: { x: 300, y: 0, width: 200, height: 90 },
    subnodes: [
      makeNode('eth:proxyAdmin', 'ProxyAdmin', [['owner', 'eth:safe']]),
      makeNode('eth:safe', 'Safe', [['bridge', 'eth:bridge']]),
    ],
  }
  const nodes = [
    makeNode(
      'eth:bridge',
      'Bridge',
      [
        ['admin', 'eth:proxyAdmin'],
        ['old', 'eth:old'],
      ],
      ['old'],
      true,
    ),
    group,
    makeNode('eth:old', 'Old'),
  ]

  it('reads drawn items, the links between them and the hidden', () => {
    expect(readGraph(makeState(nodes), 'linea')).toEqual({
      status: 'loaded',
      items: [
        {
          id: 'eth:bridge',
          name: 'Bridge',
          x: 0,
          y: 0,
          width: 200,
          height: 40,
        },
        {
          id: 'group:admins',
          name: 'Admins',
          x: 300,
          y: 0,
          width: 200,
          height: 90,
          members: ['eth:proxyAdmin', 'eth:safe'],
        },
      ],
      links: [
        [0, 1, 'admin'],
        [1, 0, 'bridge'],
      ],
      hidden: [{ id: 'eth:old', name: 'Old' }],
    })
  })

  it('answers not loaded for another project, naming the one drawn', () => {
    expect(readGraph(makeState(nodes), 'arbitrum')).toEqual({
      status: 'not-loaded',
      project: 'linea',
    })
    expect(readGraph({ ...makeState(nodes), loaded: false }, 'linea')).toEqual({
      status: 'not-loaded',
    })
  })
})

function makeState(nodes: Node[]): State {
  return {
    projectId: 'linea',
    nodes,
    selected: [],
    history: { past: [], future: [] },
    userPreferences: {
      enableDimming: true,
      hideLargeArrays: true,
      highlightOverlapping: true,
      showSecurityPerimeter: true,
    },
    transform: { offsetX: 0, offsetY: 0, scale: 1 },
    input: {
      shiftPressed: false,
      spacePressed: false,
      ctrlPressed: false,
      lmbPressed: false,
      mmbPressed: false,
      mouseStartX: 0,
      mouseStartY: 0,
      mouseX: 0,
      mouseY: 0,
    },
    positionsBeforeMove: {},
    tool: 'select',
    loaded: true,
    loadCount: 1,
  }
}

function makeNode(
  id: string,
  name: string,
  fields: Array<[name: string, target: string]> = [],
  hiddenFields: string[] = [],
  isInitial = false,
): Node {
  return {
    id,
    address: id,
    isInitial,
    isCritical: false,
    hasTemplate: false,
    addressType: 'Contract',
    name,
    fields: fields.map(([fieldName, target]) => makeField(fieldName, target)),
    hiddenFields,
    compressedRows: [],
    box: { x: 0, y: 0, width: 200, height: 40 },
    color: 0,
    hueShift: 0,
    data: null,
    isReachable: true,
    opened: false,
    subnodes: [],
  }
}

function makeField(name: string, target: string): Field {
  return {
    name,
    target,
    box: { x: 0, y: 0, width: 0, height: 0 },
    connection: {
      from: { direction: 'left', x: 0, y: 0 },
      to: { direction: 'left', x: 0, y: 0 },
    },
  }
}
