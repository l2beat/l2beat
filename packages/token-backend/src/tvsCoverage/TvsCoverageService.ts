import type { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import type { SnapshotStats, TvsCoverageSnapshot } from './buildSnapshot'

export type BuildSnapshot = () => Promise<{
  snapshot: TvsCoverageSnapshot
  stats: SnapshotStats
}>

export interface TvsCoverageState {
  // Undefined until the first build succeeds: reads never build.
  snapshot: TvsCoverageSnapshot | undefined
  building: boolean
  // When the last build failed, unless a build succeeded since.
  failedAt: number | undefined
}

// The snapshot reads every candidate's supply over RPC, so it is built on a
// timer and kept in memory instead of being rebuilt per page view.
export class TvsCoverageService {
  private latest: TvsCoverageSnapshot | undefined
  private building: Promise<TvsCoverageSnapshot> | undefined
  private failedAt: number | undefined
  private intervalHandle: ReturnType<typeof setInterval> | undefined

  constructor(
    private readonly build: BuildSnapshot,
    private readonly intervalMs: number,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  start() {
    if (this.intervalHandle) return
    this.logger.info('Started', { intervalMs: this.intervalMs })
    this.refreshInBackground()
    this.intervalHandle = setInterval(
      () => this.refreshInBackground(),
      this.intervalMs,
    )
  }

  stop() {
    clearInterval(this.intervalHandle)
    this.intervalHandle = undefined
  }

  state(): TvsCoverageState {
    return {
      snapshot: this.latest,
      building: this.building !== undefined,
      failedAt: this.failedAt,
    }
  }

  // Concurrent callers share one build, and a failed build keeps the
  // previous snapshot.
  refresh(): Promise<TvsCoverageSnapshot> {
    this.building ??= this.build()
      .then(
        ({ snapshot, stats }) => {
          this.latest = snapshot
          this.failedAt = undefined
          this.logger.info('Snapshot built', stats)
          return snapshot
        },
        (error: unknown) => {
          this.failedAt = UnixTime.now()
          throw error
        },
      )
      .finally(() => {
        this.building = undefined
      })
    return this.building
  }

  refreshInBackground() {
    this.refresh().catch((error: unknown) => {
      this.logger.error('Snapshot build failed', error)
    })
  }
}
