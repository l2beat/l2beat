import { expect } from 'earl'
import { layoutRelationsGraph } from './layoutRelationsGraph'
import { routeRelationsEdges } from './routeRelationsEdges'

describe(routeRelationsEdges.name, () => {
  it('spreads incoming edges over the target top and joins them on a bus', () => {
    const edges = [
      { from: 'S1', to: 'T' },
      { from: 'S2', to: 'T' },
    ]
    const layout = layoutRelationsGraph(
      [node('S1', 2), node('S2', 1), node('T', 1)],
      edges,
    )
    const paths = routeRelationsEdges(edges, layout)

    expect(paths.get('S1->T')?.path).toEqual('M 364 64 V 132 H 432 V 176')
    expect(paths.get('S2->T')?.path).toEqual('M 556 64 V 132 H 488 V 176')
    expect(paths.get('S1->T')?.midX).toEqual(432)
  })

  it('routes an edge that skips a row through a side lane', () => {
    const edges = [
      { from: 'S', to: 'M' },
      { from: 'M', to: 'T' },
      { from: 'S', to: 'T' },
    ]
    const layout = layoutRelationsGraph(
      [node('S', 3), node('M', 2), node('T', 1)],
      edges,
    )

    expect(routeRelationsEdges(edges, layout).get('S->T')?.path).toEqual(
      'M 460 64 V 92 H 28 V 308 H 488 V 352',
    )
  })
})

function node(id: string, volume: number) {
  return { id, volume, width: 168, height: 64 }
}
