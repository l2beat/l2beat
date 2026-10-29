import { Logger } from '@l2beat/backend-tools'
import { expect, mockFn } from 'earl'
import type { SnapshotStats, TvsCoverageSnapshot } from './buildSnapshot'
import { type BuildSnapshot, TvsCoverageService } from './TvsCoverageService'

describe(TvsCoverageService.name, () => {
  it('builds only on refresh, once for concurrent refreshes', async () => {
    let resolve: (result: Awaited<ReturnType<BuildSnapshot>>) => void = () => {}
    const build = mockFn<[], ReturnType<BuildSnapshot>>(
      () =>
        new Promise((r) => {
          resolve = r
        }),
    )
    const service = new TvsCoverageService(build, 1_000, Logger.SILENT)

    expect(service.state()).toEqual({
      snapshot: undefined,
      building: false,
      failedAt: undefined,
    })
    expect(build).toHaveBeenCalledTimes(0)

    const first = service.refresh()
    const second = service.refresh()
    expect(service.state().building).toEqual(true)
    resolve(built(1))

    expect(await first).toEqual(snapshot(1))
    expect(await second).toEqual(snapshot(1))
    expect(service.state()).toEqual({
      snapshot: snapshot(1),
      building: false,
      failedAt: undefined,
    })
    expect(build).toHaveBeenCalledTimes(1)
  })

  it('keeps the previous snapshot and reports a failed refresh until one succeeds', async () => {
    const build = mockFn<[], ReturnType<BuildSnapshot>>()
      .resolvesToOnce(built(1))
      .rejectsWithOnce(new Error('rpc down'))
      .resolvesToOnce(built(2))
    const service = new TvsCoverageService(build, 1_000, Logger.SILENT)

    await service.refresh()
    await expect(service.refresh()).toBeRejectedWith('rpc down')

    expect(service.state().snapshot).toEqual(snapshot(1))
    expect(service.state().failedAt).not.toEqual(undefined)

    await service.refresh()
    expect(service.state().snapshot).toEqual(snapshot(2))
    expect(service.state().failedAt).toEqual(undefined)
  })
})

function built(generatedAt: number) {
  return { snapshot: snapshot(generatedAt), stats: {} as SnapshotStats }
}

function snapshot(generatedAt: number): TvsCoverageSnapshot {
  return {
    generatedAt,
    window: { days: 30, from: 0, to: generatedAt },
    minChainVolumeUsd: 0,
    projects: [],
    chains: [],
    bridges: [],
    rows: [],
    warnings: [],
  }
}
