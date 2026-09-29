import { expect } from 'earl'
import type { DaFlowsProject } from '~/server/features/data-availability/flows/getDaFlowsProjects'
import { buildDaFlowsGraph, OTHERS_ID } from './buildDaFlowsGraph'

describe(buildDaFlowsGraph.name, () => {
  const daLayer = project('ethereum')

  it('puts the DA layer first and sends every poster to it', () => {
    const graph = buildDaFlowsGraph(
      daLayer,
      [project('a'), project('b')],
      { a: 100, b: 300 },
      15,
    )

    expect(graph.nodes.map((n) => n.id)).toEqual(['ethereum', 'b', 'a'])
    expect(graph.data.flows).toEqual([
      { srcChain: 'b', dstChain: 'ethereum', volume: 300 },
      { srcChain: 'a', dstChain: 'ethereum', volume: 100 },
    ])
    expect(graph.totalPosted).toEqual(400)
    expect(graph.data.chainData[0]).toEqual({
      chainId: 'ethereum',
      totalVolume: 400,
      netFlow: 400,
    })
  })

  it('sums posters that do not fit on the ring into Others', () => {
    const graph = buildDaFlowsGraph(
      daLayer,
      [project('a'), project('b'), project('c'), project('d')],
      { a: 400, b: 300, c: 200, d: 100 },
      3,
    )

    expect(graph.nodes.map((n) => n.id)).toEqual([
      'ethereum',
      'a',
      'b',
      OTHERS_ID,
    ])
    expect(graph.data.flows.at(-1)).toEqual({
      srcChain: OTHERS_ID,
      dstChain: 'ethereum',
      volume: 300,
    })
    // nothing is lost: the flows still add up to the total
    expect(graph.data.flows.reduce((sum, f) => sum + f.volume, 0)).toEqual(
      graph.totalPosted,
    )
  })

  it('keeps every poster in the ranking, on the ring or not', () => {
    const graph = buildDaFlowsGraph(
      daLayer,
      [project('a'), project('b'), project('c')],
      { a: 600, b: 300, c: 100 },
      2,
    )

    expect(graph.posters.map((p) => [p.id, p.share])).toEqual([
      ['a', 0.6],
      ['b', 0.3],
      ['c', 0.1],
    ])
  })

  it('counts a poster it cannot draw towards Others', () => {
    const graph = buildDaFlowsGraph(
      daLayer,
      [project('a')],
      { a: 100, unknown: 50 },
      15,
    )

    expect(graph.nodes.map((n) => n.id)).toEqual(['ethereum', 'a', OTHERS_ID])
    expect(graph.data.flows.at(-1)?.volume).toEqual(50)
  })

  it('leaves out projects that posted nothing', () => {
    const graph = buildDaFlowsGraph(
      daLayer,
      [project('a'), project('b')],
      { a: 100, b: 0 },
      15,
    )

    expect(graph.nodes.map((n) => n.id)).toEqual(['ethereum', 'a'])
    expect(graph.posters.length).toEqual(1)
  })

  it('returns only the DA layer when nothing was posted', () => {
    const graph = buildDaFlowsGraph(daLayer, [project('a')], {}, 15)

    expect(graph.nodes.map((n) => n.id)).toEqual(['ethereum'])
    expect(graph.data.flows).toEqual([])
    expect(graph.totalPosted).toEqual(0)
  })
})

function project(id: string): DaFlowsProject {
  return {
    id,
    name: id.toUpperCase(),
    iconUrl: `/icons/${id}.png`,
    color: '#000000',
    href: `/layer2s/projects/${id}`,
  }
}
