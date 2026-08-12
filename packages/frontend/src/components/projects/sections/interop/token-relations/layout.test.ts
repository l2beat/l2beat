import { expect } from 'earl'
import type {
  InteropTokenRelationsEdge,
  InteropTokenRelationsNode,
} from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { layoutRelationsGraph, NODE_WIDTH } from './layout'

describe(layoutRelationsGraph.name, () => {
  it('puts a backed node to the right of the node backing it', () => {
    const layout = layoutRelationsGraph(
      [node('a'), node('b')],
      [edge('a', 'b')],
      [],
    )

    const a = layout.boxes.get('a')
    const b = layout.boxes.get('b')
    expect(a).not.toBeNullish()
    expect(b).not.toBeNullish()
    expect((a as { x: number }).x).toBeLessThan((b as { x: number }).x)
  })

  it('uses the longest path so a node sits right of all of its backers', () => {
    // a backs b, a backs c, b backs c — c must clear b, not just a.
    const layout = layoutRelationsGraph(
      [node('a'), node('b'), node('c')],
      [edge('a', 'b'), edge('a', 'c'), edge('b', 'c')],
      [],
    )

    const x = (id: string) => layout.boxes.get(id)?.x ?? 0
    expect(x('a')).toBeLessThan(x('b'))
    expect(x('b')).toBeLessThan(x('c'))
  })

  it('gives every node a box', () => {
    const nodes = [node('a'), node('b'), node('c')]
    const layout = layoutRelationsGraph(nodes, [edge('a', 'b')], ['c'])

    expect([...layout.boxes.keys()].toSorted()).toEqual(['a', 'b', 'c'])
    expect(layout.width).toBeGreaterThanOrEqual(NODE_WIDTH)
    expect(layout.height).toBeGreaterThan(0)
  })

  it('sets unconnected nodes to the right of everything else', () => {
    const layout = layoutRelationsGraph(
      [node('a'), node('b'), node('loose')],
      [edge('a', 'b')],
      ['loose'],
    )

    expect(layout.unconnectedDividerX).not.toBeNullish()
    const dividerX = layout.unconnectedDividerX as number
    const connectedRight = Math.max(
      (layout.boxes.get('a')?.x ?? 0) + NODE_WIDTH,
      (layout.boxes.get('b')?.x ?? 0) + NODE_WIDTH,
    )
    expect(connectedRight).toBeLessThanOrEqual(dividerX)
    expect(layout.boxes.get('loose')?.x ?? 0).toBeGreaterThan(dividerX)
  })

  it('has no divider when every node is connected', () => {
    const layout = layoutRelationsGraph(
      [node('a'), node('b')],
      [edge('a', 'b')],
      [],
    )

    expect(layout.unconnectedDividerX).toEqual(undefined)
  })

  it('aligns a node with the top of its children, kept contiguous', () => {
    const layout = layoutRelationsGraph(
      [node('a'), node('b'), node('c'), node('d')],
      [edge('a', 'b'), edge('a', 'c'), edge('a', 'd')],
      [],
    )

    const y = (id: string) => layout.boxes.get(id)?.y ?? 0
    const children = ['b', 'c', 'd'].map(y).toSorted((x, z) => x - z)
    expect(y('a')).toEqual(children[0] as number)
    // Evenly spaced, so nothing else can sit between them.
    const firstGap = (children[1] as number) - (children[0] as number)
    const secondGap = (children[2] as number) - (children[1] as number)
    expect(firstGap).toBeCloseTo(secondGap, 1)
  })

  it('puts the busiest root at the very top, not level with its block middle', () => {
    // The busiest root backs three nodes; top-aligned it leads the column.
    const layout = layoutRelationsGraph(
      [
        node('busy', 1, 900),
        node('quiet', 1, 5),
        node('k1'),
        node('k2'),
        node('k3'),
      ],
      [edge('busy', 'k1'), edge('busy', 'k2'), edge('busy', 'k3')],
      [],
    )

    const y = (id: string) => layout.boxes.get(id)?.y ?? 0
    expect(y('busy')).toEqual(0)
    expect(y('busy')).toBeLessThan(y('quiet'))
  })

  it('keeps separate parents over separate blocks of children', () => {
    const layout = layoutRelationsGraph(
      [node('p1'), node('p2'), node('c1'), node('c2'), node('c3')],
      [edge('p1', 'c1'), edge('p1', 'c2'), edge('p2', 'c3')],
      [],
    )

    const y = (id: string) => layout.boxes.get(id)?.y ?? 0
    // p1's children must both sit above p2's, with no interleaving.
    expect(Math.max(y('c1'), y('c2'))).toBeLessThan(y('c3'))
  })

  it('puts the busiest node at the top of the left column', () => {
    const layout = layoutRelationsGraph(
      [node('a', 1, 10), node('b', 1, 900), node('c', 1, 300)],
      [],
      [],
    )

    const order = ['a', 'b', 'c'].toSorted(
      (x, y) => (layout.boxes.get(x)?.y ?? 0) - (layout.boxes.get(y)?.y ?? 0),
    )
    expect(order).toEqual(['b', 'c', 'a'])
  })

  it("orders one backer's children by volume, keeping the block together", () => {
    const layout = layoutRelationsGraph(
      [
        node('p1', 1, 500),
        node('p2', 1, 100),
        node('big', 1, 900),
        node('small', 1, 5),
        node('other', 1, 700),
      ],
      [edge('p1', 'big'), edge('p1', 'small'), edge('p2', 'other')],
      [],
    )

    const y = (id: string) => layout.boxes.get(id)?.y ?? 0
    // p1 is the busier backer, so its block comes first…
    expect(Math.max(y('big'), y('small'))).toBeLessThan(y('other'))
    // …and inside that block the busier child is on top, even though the
    // other backer's child outranks it on volume overall.
    expect(y('big')).toBeLessThan(y('small'))
  })

  it('sorts a node with no measured volume below one with zero', () => {
    const layout = layoutRelationsGraph(
      [node('measured', 1, 0), node('unmeasured', 1, null)],
      [],
      [],
    )

    expect(layout.boxes.get('measured')?.y ?? 0).toBeLessThan(
      layout.boxes.get('unmeasured')?.y ?? 0,
    )
  })

  it('reports the column each node landed in', () => {
    const layout = layoutRelationsGraph(
      [node('a'), node('b')],
      [edge('a', 'b')],
      [],
    )

    expect(layout.columnOf.get('a')).toEqual(0)
    expect(layout.columnOf.get('b')).toEqual(1)
  })

  it('ignores connections with no identified direction when placing columns', () => {
    const layout = layoutRelationsGraph(
      [node('a'), node('b')],
      [{ from: 'a', to: 'b', kind: 'related', bridges: [] }],
      [],
    )

    expect(layout.boxes.get('a')?.x).toEqual(layout.boxes.get('b')?.x)
  })

  it('is deterministic regardless of input order', () => {
    const nodes = [node('a'), node('b'), node('c')]
    const edges = [edge('a', 'b'), edge('a', 'c')]
    const forward = layoutRelationsGraph(nodes, edges, [])
    const reversed = layoutRelationsGraph(
      [...nodes].reverse(),
      [...edges].reverse(),
      [],
    )

    expect([...forward.boxes]).toEqual([...reversed.boxes])
  })

  it('still places every node if the backing edges somehow form a cycle', () => {
    const layout = layoutRelationsGraph(
      [node('a'), node('b')],
      [edge('a', 'b'), edge('b', 'a')],
      [],
    )

    expect([...layout.boxes.keys()].toSorted()).toEqual(['a', 'b'])
  })
})

function node(
  id: string,
  members = 1,
  volume: number | null = null,
): InteropTokenRelationsNode {
  return {
    id,
    bridges: [],
    volume,
    deployments: Array.from({ length: members }, (_, i) => ({
      chain: `chain${i}`,
      chainName: `Chain ${i}`,
      iconUrl: undefined,
      address: `0x${id}${i}`,
      symbol: 'TOKEN',
      explorerUrl: undefined,
    })),
  }
}

function edge(from: string, to: string): InteropTokenRelationsEdge {
  return { from, to, kind: 'backs', bridges: [] }
}
