import { expect } from 'earl'
import type { InteropHistoryData } from '~/server/features/layer2s/interop/history/types'
import {
  applyHistoryExclusions,
  type HistoryExclusions,
  NO_EXCLUSIONS,
} from './applyHistoryExclusions'

describe(applyHistoryExclusions.name, () => {
  const all: HistoryExclusions = {
    laneCap: true,
    tokenDays: true,
    blocked: true,
  }

  it('marks a lane above the cap and keeps it unless excluded', () => {
    const input = data({ laneCandidates: [lane(4e11)] })

    const kept = applyHistoryExclusions(input, NO_EXCLUSIONS)
    expect(kept.volume.p1).toEqual(input.byProtocol.p1?.volume)
    expect(kept.cappedLanes.map((l) => [l.volume, l.excluded])).toEqual([
      [4e11, false],
    ])

    const excluded = applyHistoryExclusions(input, all)
    expect(excluded.volume.p1).toEqual([1e9, 1e9])
    expect(excluded.byChain.base?.inflow).toEqual([1e9, 1e9])
    expect(excluded.byChain.ethereum?.outflow).toEqual([1e9, 1e9])
  })

  it('marks a token-day on what the cap left of it, whatever is excluded', () => {
    const token = (laneVolume: number) => ({
      point: 1,
      id: 'p1',
      token: 'XYZ',
      volume: 1.2e9,
      baseline: 1e6,
      lanes: [
        {
          ...route('ethereum', 'base'),
          volume: 9e8,
          laneVolume,
          inSelection: true,
        },
        {
          ...route('ethereum', 'arbitrum'),
          volume: 3e8,
          laneVolume: undefined,
          inSelection: false,
        },
      ],
    })

    // The capped lane takes 9e8, and 3e8 is under the floor.
    expect(
      applyHistoryExclusions(data({ tokenCandidates: [token(2e9)] }), all)
        .tokenDays,
    ).toEqual([])

    const input = data({ tokenCandidates: [token(9.5e8)] })
    const kept = applyHistoryExclusions(input, NO_EXCLUSIONS)
    expect(kept.tokenDays.map((t) => t.volume)).toEqual([9e8])
    expect(kept.volume.p1).toEqual([1e9, 4e11 + 1e9])

    // Only the selected lane comes out.
    const excluded = applyHistoryExclusions(input, all)
    expect(excluded.volume.p1).toEqual([1e9, 4e11 + 1e9 - 9e8])
  })
})

function route(srcChain: string, dstChain: string) {
  return { bridgeType: 'lockAndMint' as const, srcChain, dstChain }
}

function lane(volume: number): InteropHistoryData['laneCandidates'][number] {
  return {
    point: 1,
    id: 'p1',
    ...route('ethereum', 'base'),
    volume,
    topToken: 'DGLD',
  }
}

function data(overrides: Partial<InteropHistoryData>): InteropHistoryData {
  return {
    resolution: 'daily',
    points: [0, 1].map((i) => ({
      timestamp: i * 86400,
      snapshot: i * 86400,
      isBlocked: false,
      carriedLanes: 0,
      partialLanes: 0,
    })),
    protocols: [{ id: 'p1', name: 'P1', iconUrl: undefined, isListed: true }],
    byProtocol: {
      p1: {
        volume: [1e9, 4e11 + 1e9],
        transferCount: [10, 10],
        timedTransferCount: [10, 10],
        durationSum: [100, 100],
      },
    },
    byChain: {
      ethereum: { inflow: [0, 0], outflow: [1e9, 4e11 + 1e9] },
      base: { inflow: [1e9, 4e11 + 1e9], outflow: [0, 0] },
    },
    laneCandidates: [],
    tokenCandidates: [],
    ...overrides,
  }
}
