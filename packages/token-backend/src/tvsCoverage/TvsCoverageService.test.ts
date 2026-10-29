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

    expect(service.get()).toEqual(undefined)
    expect(build).toHaveBeenCalledTimes(0)

    const first = service.refresh()
    const second = service.refresh()
    expect(service.isBuilding()).toEqual(true)
    resolve(built(1))

    expect(await first).toEqual(snapshot(1))
    expect(await second).toEqual(snapshot(1))
    expect(service.get()).toEqual(snapshot(1))
    expect(service.isBuilding()).toEqual(false)
    expect(build).toHaveBeenCalledTimes(1)
  })

  it('keeps the previous snapshot when a refresh fails', async () => {
    const build = mockFn<[], ReturnType<BuildSnapshot>>()
      .resolvesToOnce(built(1))
      .rejectsWithOnce(new Error('rpc down'))
    const service = new TvsCoverageService(build, 1_000, Logger.SILENT)

    await service.refresh()
    await expect(service.refresh()).toBeRejectedWith('rpc down')

    expect(service.get()).toEqual(snapshot(1))
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
