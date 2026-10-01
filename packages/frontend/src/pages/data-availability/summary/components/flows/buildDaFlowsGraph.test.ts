import { expect } from 'earl'
import type { DaFlowsProject } from '~/server/features/data-availability/flows/getDaFlowsProjects'
import {
  buildDaFlowsGraph,
  type DaFlowsInput,
  OTHERS_ID,
} from './buildDaFlowsGraph'

describe(buildDaFlowsGraph.name, () => {
  const daLayer = project('ethereum')

  it('puts the DA layer first and sends every poster to it', () => {
    const graph = buildDaFlowsGraph(
      daLayer,
      [project('a'), project('b')],
      flows({ a: 100, b: 300 }),
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
      flows({ a: 400, b: 300, c: 200, d: 100 }),
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
      flows({ a: 600, b: 300, c: 100 }),
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
      flows({ a: 100, unknown: 50 }),
      15,
    )

    expect(graph.nodes.map((n) => n.id)).toEqual(['ethereum', 'a', OTHERS_ID])
    expect(graph.data.flows.at(-1)?.volume).toEqual(50)
  })

  it('leaves out projects that posted nothing', () => {
    const graph = buildDaFlowsGraph(
      daLayer,
      [project('a'), project('b')],
      flows({ a: 100, b: 0 }),
      15,
    )

    expect(graph.nodes.map((n) => n.id)).toEqual(['ethereum', 'a'])
    expect(graph.posters.length).toEqual(1)
  })

  it('sends a poster whose batches are timed a batch at a time', () => {
    const graph = buildDaFlowsGraph(
      daLayer,
      [project('a'), project('b')],
      // a posts every 100 s, so 10 times over the 1000 s
      flows({ a: 5000, b: 300 }, { a: 100 }),
      15,
    )

    expect(graph.posters.map((p) => p.batch)).toEqual([
      { interval: 100, size: 500 },
      undefined,
    ])
    expect(graph.data.flows).toEqual([
      { srcChain: 'a', dstChain: 'ethereum', volume: 5000, burstVolume: 500 },
      { srcChain: 'b', dstChain: 'ethereum', volume: 300 },
    ])
  })

  it('never makes a batch larger than everything that was posted', () => {
    const graph = buildDaFlowsGraph(
      daLayer,
      [project('a')],
      flows({ a: 5000 }, { a: 4000 }),
      15,
    )

    expect(graph.posters[0]?.batch).toEqual({ interval: 4000, size: 5000 })
  })

  it('never makes a batch smaller than the least the DA layer takes', () => {
    const graph = buildDaFlowsGraph(
      daLayer,
      [project('a'), project('b')],
      // a sends a batch every 10 s but posted only 3 blobs of 100 over the
      // 1000 s, so most of its batches carried none
      flows({ a: 300, b: 3000 }, { a: 10, b: 100 }),
      15,
      100,
    )

    expect(graph.posters.map((p) => p.batch)).toEqual([
      { interval: 100, size: 300 },
      // one blob at a time, three of them over the 1000 s
      { interval: 1000 / 3, size: 100 },
    ])
  })

  it('sends Others as a steady stream', () => {
    const graph = buildDaFlowsGraph(
      daLayer,
      [project('a'), project('b'), project('c')],
      flows({ a: 600, b: 300, c: 100 }, { a: 100, b: 100, c: 100 }),
      2,
    )

    expect(graph.data.flows.at(-1)).toEqual({
      srcChain: OTHERS_ID,
      dstChain: 'ethereum',
      volume: 400,
    })
    // the list still tells how each of them posts
    expect(graph.posters.every((p) => p.batch !== undefined)).toEqual(true)
  })

  it('returns only the DA layer when nothing was posted', () => {
    const graph = buildDaFlowsGraph(daLayer, [project('a')], flows({}), 15)

    expect(graph.nodes.map((n) => n.id)).toEqual(['ethereum'])
    expect(graph.data.flows).toEqual([])
    expect(graph.totalPosted).toEqual(0)
  })
})

function flows(
  posted: Record<string, number>,
  batchIntervals: Record<string, number> = {},
): DaFlowsInput {
  return { posted, batchIntervals, range: [1000, 2000] }
}

function project(id: string): DaFlowsProject {
  return {
    id,
    name: id.toUpperCase(),
    iconUrl: `/icons/${id}.png`,
    color: '#000000',
    href: `/layer2s/projects/${id}`,
  }
}
