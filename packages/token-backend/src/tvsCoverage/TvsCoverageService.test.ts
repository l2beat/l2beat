import { Logger } from '@l2beat/backend-tools'
import { expect, mockFn } from 'earl'
import type { TvsCoverageSnapshot } from './buildSnapshot'
import { TvsCoverageService } from './TvsCoverageService'

describe(TvsCoverageService.name, () => {
  it('builds once for concurrent requests and then serves the latest snapshot', async () => {
    let resolve: (snapshot: TvsCoverageSnapshot) => void = () => {}
    const build = mockFn(
      (_: number) =>
        new Promise<TvsCoverageSnapshot>((r) => {
          resolve = r
        }),
    )
    const service = new TvsCoverageService(
      build,
      { intervalMs: 1_000, windowDays: 30 },
      Logger.SILENT,
    )

    const first = service.get()
    const second = service.get()
    resolve(snapshot(1))

    expect(await first).toEqual(snapshot(1))
    expect(await second).toEqual(snapshot(1))
    expect(await service.get()).toEqual(snapshot(1))
    expect(build).toHaveBeenOnlyCalledWith(30)
  })

  it('keeps the previous snapshot when a refresh fails', async () => {
    const build = mockFn<[number], Promise<TvsCoverageSnapshot>>()
      .resolvesToOnce(snapshot(1))
      .rejectsWithOnce(new Error('rpc down'))
    const service = new TvsCoverageService(
      build,
      { intervalMs: 1_000, windowDays: 30 },
      Logger.SILENT,
    )

    await service.refresh()
    await expect(service.refresh()).toBeRejectedWith('rpc down')

    expect(await service.get()).toEqual(snapshot(1))
  })
})

function snapshot(generatedAt: number): TvsCoverageSnapshot {
  return {
    generatedAt,
    durationMs: 0,
    window: { days: 30, from: 0, to: generatedAt },
    projects: [],
    chains: [],
    bridges: [],
    rows: [],
    warnings: [],
  }
}
