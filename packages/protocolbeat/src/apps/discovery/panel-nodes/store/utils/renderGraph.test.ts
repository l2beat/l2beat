import { expect } from 'earl'
import type { Field, Node } from '../State'
import { buildRenderGraph, isFieldConnectionLive } from './renderGraph'

describe(buildRenderGraph.name, () => {
  it('keeps a collapsed group row live through a visible member edge', () => {
    const member = makeNode('member', [['owner', 'target']])
    const group = makeGroup('group', [member], [makeField('member', 'target')])

    const graph = buildRenderGraph([group, makeNode('target')])

    expect(graph.liveGroupTargets.get('group')).toEqual(new Set(['target']))
    expect(
      isFieldConnectionLive(
        group,
        group.fields[0] as Field,
        graph.liveGroupTargets,
      ),
    ).toEqual(true)
  })

  it('removes a collapsed group row when every member edge is hidden', () => {
    const member = makeNode('member', [['owner', 'target']], ['owner'])
    const group = makeGroup('group', [member], [makeField('member', 'target')])

    const graph = buildRenderGraph([group, makeNode('target')])

    expect(graph.liveGroupTargets.has('group')).toEqual(false)
    expect(
      isFieldConnectionLive(
        group,
        group.fields[0] as Field,
        graph.liveGroupTargets,
      ),
    ).toEqual(false)
  })

  it('respects fields hidden directly on a collapsed group', () => {
    const member = makeNode('member', [['owner', 'target']])
    const group = {
      ...makeGroup('group', [member], [makeField('member', 'target')]),
      hiddenFields: ['member'],
    }

    const graph = buildRenderGraph([group, makeNode('target')])

    expect(
      isFieldConnectionLive(
        group,
        group.fields[0] as Field,
        graph.liveGroupTargets,
      ),
    ).toEqual(false)
  })
})

function makeGroup(id: string, subnodes: Node[], fields: Field[]): Node {
  return {
    ...makeNode(id),
    addressType: 'Group',
    fields,
    subnodes,
  }
}

function makeNode(
  id: string,
  fields: Array<[name: string, target: string]> = [],
  hiddenFields: string[] = [],
): Node {
  return {
    id,
    address: `test:${id}`,
    isInitial: false,
    hasTemplate: false,
    addressType: 'Contract',
    name: id,
    fields: fields.map(([name, target]) => makeField(name, target)),
    hiddenFields,
    box: { x: 0, y: 0, width: 200, height: 0 },
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
