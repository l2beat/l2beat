import type { Logger } from '@l2beat/backend-tools'
import type { TvsCoverageSnapshot } from './buildSnapshot'

export interface TvsCoverageServiceOptions {
  intervalMs: number
  windowDays: number
}

// The snapshot reads every candidate's supply over RPC, so it is built on a
// timer and kept in memory instead of being rebuilt per page view.
export class TvsCoverageService {
  private latest: TvsCoverageSnapshot | undefined
  private building: Promise<TvsCoverageSnapshot> | undefined
  private intervalHandle: NodeJS.Timeout | undefined
  private readonly logger: Logger

  constructor(
    private readonly build: (days: number) => Promise<TvsCoverageSnapshot>,
    private readonly options: TvsCoverageServiceOptions,
    logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  start() {
    if (this.intervalHandle) return
    this.refreshInBackground()
    this.intervalHandle = setInterval(
      () => this.refreshInBackground(),
      this.options.intervalMs,
    )
  }

  stop() {
    clearInterval(this.intervalHandle)
    this.intervalHandle = undefined
  }

  async get(): Promise<TvsCoverageSnapshot> {
    return this.latest ?? (await this.refresh())
  }

  refresh(): Promise<TvsCoverageSnapshot> {
    if (!this.building) {
      this.building = this.build(this.options.windowDays)
        .then((snapshot) => {
          this.latest = snapshot
          this.logger.info('Snapshot built', {
            rows: snapshot.rows.length,
            durationMs: snapshot.durationMs,
            warnings: snapshot.warnings.length,
          })
          return snapshot
        })
        .finally(() => {
          this.building = undefined
        })
    }
    return this.building
  }

  private refreshInBackground() {
    this.refresh().catch((error: unknown) => {
      this.logger.error('Snapshot build failed', error)
    })
  }
}
