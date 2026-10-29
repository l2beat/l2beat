import type { Logger } from '@l2beat/backend-tools'
import type { SnapshotStats, TvsCoverageSnapshot } from './buildSnapshot'

export type BuildSnapshot = () => Promise<{
  snapshot: TvsCoverageSnapshot
  stats: SnapshotStats
}>

// The snapshot reads every candidate's supply over RPC, so it is built on a
// timer and kept in memory instead of being rebuilt per page view.
export class TvsCoverageService {
  private latest: TvsCoverageSnapshot | undefined
  private building: Promise<TvsCoverageSnapshot> | undefined
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

  // Reads never build: until the first build succeeds there is no snapshot.
  get(): TvsCoverageSnapshot | undefined {
    return this.latest
  }

  isBuilding(): boolean {
    return this.building !== undefined
  }

  // Concurrent callers share one build, and a failed build keeps the
  // previous snapshot.
  refresh(): Promise<TvsCoverageSnapshot> {
    this.building ??= this.build()
      .then(({ snapshot, stats }) => {
        this.latest = snapshot
        this.logger.info('Snapshot built', stats)
        return snapshot
      })
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
