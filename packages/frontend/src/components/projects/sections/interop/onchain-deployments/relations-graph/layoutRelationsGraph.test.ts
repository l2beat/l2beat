import { expect } from 'earl'
import { type LayoutNode, layoutRelationsGraph } from './layoutRelationsGraph'

describe(layoutRelationsGraph.name, () => {
  it('rows nodes by backing depth, busiest first, children under their backer', () => {
    const layout = layoutRelationsGraph(
      [node('E', 100), node('A', 50), node('B', null), node('C', 10)],
      [edge('E', 'A'), edge('E', 'B'), edge('A', 'C')],
    )

    expect([...layout.rowOf]).toEqualUnsorted([
      ['E', 0],
      ['A', 1],
      ['B', 1],
      ['C', 2],
    ])
    expect(layout.boxes.get('E')).toEqual({
      x: 376,
      y: 0,
      width: 168,
      height: 64,
    })
    expect(layout.boxes.get('A')).toEqual({
      x: 280,
      y: 176,
      width: 168,
      height: 64,
    })
    expect(layout.boxes.get('B')).toEqual({
      x: 472,
      y: 176,
      width: 168,
      height: 64,
    })
    expect(layout.boxes.get('C')?.x).toEqual(376)
    expect(layout).toHaveSubset({
      width: 920,
      height: 416,
      unconnectedDividerY: undefined,
    })
  })

  it("wraps a wide layer without splitting a backer's children across rows", () => {
    const wide = { width: 400, height: 64 }
    const layout = layoutRelationsGraph(
      [
        node('P', 100, wide),
        node('Q', 50, wide),
        node('R', 10, wide),
        node('p1', 5, wide),
        node('p2', 4, wide),
        node('q1', 3, wide),
        node('q2', 2, wide),
        node('r1', 1, wide),
      ],
      [
        edge('P', 'p1'),
        edge('P', 'p2'),
        edge('Q', 'q1'),
        edge('Q', 'q2'),
        edge('R', 'r1'),
      ],
    )

    expect(layout.width).toEqual(1760)
    expect(
      ['p1', 'p2', 'q1', 'q2', 'r1'].map((id) => layout.rowOf.get(id)),
    ).toEqual([1, 1, 2, 2, 2])
  })

  it('places unconnected nodes below a divider', () => {
    const layout = layoutRelationsGraph(
      [node('E', 100)],
      [],
      [node('U', 1), node('V', 2)],
    )

    expect(layout.unconnectedDividerY).toEqual(120)
    expect(layout.rowOf.get('U')).toEqual(1)
    expect(
      (layout.boxes.get('V')?.x ?? 0) < (layout.boxes.get('U')?.x ?? 0),
    ).toEqual(true)
  })

  it('keeps nodes on a cycle instead of dropping them', () => {
    const layout = layoutRelationsGraph(
      [node('A', 1), node('B', 1), node('C', 1)],
      [edge('A', 'B'), edge('B', 'C'), edge('C', 'A')],
    )

    expect([...layout.rowOf.values()]).toEqual([0, 0, 0])
  })
})

function node(
  id: string,
  volume: number | null,
  size = { width: 168, height: 64 },
): LayoutNode {
  return { id, volume, ...size }
}

function edge(from: string, to: string) {
  return { from, to }
}
