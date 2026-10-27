import { Logger } from '@l2beat/backend-tools'
import { expect, mockFn } from 'earl'
import type { SnapshotStats, TvsCoverageSnapshot } from './buildSnapshot'
import { type BuildSnapshot, TvsCoverageService } from './TvsCoverageService'

describe(TvsCoverageService.name, () => {
  it('builds once for concurrent requests and then serves the latest snapshot', async () => {
    let resolve: (result: Awaited<ReturnType<BuildSnapshot>>) => void = () => {}
    const build = mockFn<[], ReturnType<BuildSnapshot>>(
      () =>
        new Promise((r) => {
          resolve = r
        }),
    )
    const service = new TvsCoverageService(build, 1_000, Logger.SILENT)

    const first = service.get()
    const second = service.get()
    resolve(built(1))

    expect(await first).toEqual(snapshot(1))
    expect(await second).toEqual(snapshot(1))
    expect(await service.get()).toEqual(snapshot(1))
    expect(build).toHaveBeenCalledTimes(1)
  })

  it('keeps the previous snapshot when a refresh fails', async () => {
    const build = mockFn<[], ReturnType<BuildSnapshot>>()
      .resolvesToOnce(built(1))
      .rejectsWithOnce(new Error('rpc down'))
    const service = new TvsCoverageService(build, 1_000, Logger.SILENT)

    await service.refresh()
    await expect(service.refresh()).toBeRejectedWith('rpc down')

    expect(await service.get()).toEqual(snapshot(1))
  })
})

function built(generatedAt: number) {
  return { snapshot: snapshot(generatedAt), stats: {} as SnapshotStats }
}

function snapshot(generatedAt: number): TvsCoverageSnapshot {
  return {
    generatedAt,
    window: { days: 30, from: 0, to: generatedAt },
    projects: [],
    chains: [],
    bridges: [],
    rows: [],
    warnings: [],
  }
}
