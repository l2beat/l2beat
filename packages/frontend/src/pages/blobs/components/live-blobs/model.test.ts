import type { DaLayerThroughput } from '@l2beat/config'
import { expect } from 'earl'
import {
  getBlockLimits,
  inRanking,
  type LivePoster,
  nextLimitsIn,
  totalByPoster,
  UNKNOWN_ID,
} from './model'

// Methodology: two configured throughputs, one in force and one to come, as
// Ethereum's forks raise the blob limits.
describe(nextLimitsIn.name, () => {
  const KIB = 1024
  const throughputs: DaLayerThroughput[] = [
    {
      size: 6 * 128 * KIB,
      target: 3 * 128 * KIB,
      frequency: 12,
      sinceTimestamp: 1000,
    },
    {
      size: 9 * 128 * KIB,
      target: 6 * 128 * KIB,
      frequency: 12,
      sinceTimestamp: 5000,
    },
  ]

  it('tells how long the limits in force hold', () => {
    expect(nextLimitsIn(throughputs, 1200)).toEqual(3800)
    expect(getBlockLimits(throughputs, 1200).maxBlobsPerBlock).toEqual(6)
  })

  it('tells nothing once the last configured limits are in force', () => {
    expect(nextLimitsIn(throughputs, 5000)).toEqual(undefined)
    expect(getBlockLimits(throughputs, 5000).maxBlobsPerBlock).toEqual(9)
  })
})

// Methodology: a window's posts as the server sends them, a project the page
// does not list among them, read against two known posters and the stand-in.
describe(totalByPoster.name, () => {
  const poster = (id: string): LivePoster => ({
    id,
    name: id,
    iconUrl: undefined,
    href: undefined,
    color: '#000000',
  })
  const posters = [poster('base'), poster('arbitrum'), poster(UNKNOWN_ID)]
  const posted = (
    projectId: string | undefined,
    blobs: number,
    lastSlot: number,
  ) => ({
    projectId,
    blobs,
    batches: 1,
    lastSlot,
    lastBlobs: blobs,
    buckets: [blobs],
  })

  it('sums by poster, most blobs first, with unlisted projects as unknown', () => {
    const totals = totalByPoster(
      [
        posted('base', 3, 10),
        posted(undefined, 2, 12),
        posted('archived', 4, 12),
        posted('arbitrum', 5, 11),
      ],
      posters,
    )

    expect(totals.blobs).toEqual(14)
    expect(
      totals.posters.map((p) => [p.poster.id, p.blobs, p.batches, p.lastBlobs]),
    ).toEqual([
      [UNKNOWN_ID, 6, 2, 6],
      ['arbitrum', 5, 1, 5],
      ['base', 3, 1, 3],
    ])
  })
})

// Methodology: three posters ranked a block ago, now in another order by their
// raw totals, one of them new to the window.
describe(inRanking.name, () => {
  const row = (id: string, blobs: number) => ({
    poster: {
      id,
      name: id,
      iconUrl: undefined,
      href: undefined,
      color: '#000000',
    },
    blobs,
    batches: 1,
    lastSlot: 0,
    lastBlobs: 0,
    buckets: [],
  })

  it('keeps the ranking held, with posters new to it last', () => {
    const rows = [row('new', 9), row('arbitrum', 8), row('base', 7)]

    expect(
      inRanking(rows, ['base', 'arbitrum']).map((r) => r.poster.id),
    ).toEqual(['base', 'arbitrum', 'new'])
  })
})
