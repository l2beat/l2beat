import { Logger } from '@l2beat/backend-tools'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { EventEmitter } from 'events'
import { Knex } from 'knex'
import { Gauge } from 'prom-client'

import { TaskQueue } from '../../tools/queue/TaskQueue'
import { SequenceProcessorRepository } from './repositories/SequenceProcessorRepository'

const activityLast = new Gauge({
  name: 'activity_last_synced',
  help: 'Last unit (block or day) synced by the sequence processor',
  labelNames: ['project'],
})

const activityLatest = new Gauge({
  name: 'activity_latest',
  help: 'Latest existing unit to be synced to',
  labelNames: ['project'],
})

const activityConfig = new Gauge({
  name: 'activity_config',
  help: 'Activity config info',
  labelNames: [
    'project',
    'scheduleIntervalMs',
    'batchSize',
    'uncertaintyBuffer',
  ],
})

export interface SequenceProcessorOpts {
  startFrom: number
  batchSize: number
  uncertaintyBuffer?: number // resync from lastProcessed - uncertaintyBuffer
  scheduleIntervalMs?: number
}

export const ALL_PROCESSED_EVENT = 'All processed'

const HOUR = 1000 * 60 * 60

interface State {
  latest: number
  lastProcessed: number
  syncedOnce: boolean
}

export abstract class SequenceProcessor extends EventEmitter {
  private readonly processQueue: TaskQueue<void>
  private readonly scheduleInterval: number
  private readonly uncertaintyBuffer: number
  private state?: State
  private refreshId: ReturnType<typeof setTimeout> | undefined

  protected abstract getLatest(current: number): Promise<number>
  protected abstract processRange(
    from: number, // inclusive
    to: number, // inclusive
    trx: Knex.Transaction,
  ): Promise<void>

  constructor(
    readonly projectId: ProjectId,
    private readonly repository: SequenceProcessorRepository,
    private readonly opts: SequenceProcessorOpts,
    protected logger: Logger,
  ) {
    super()

    assert(opts.batchSize > 0)

    this.processQueue = new TaskQueue<void>(
      () => this.process(),
      this.logger.for('updateQueue'),
      {
        metricsId: `${SequenceProcessor.name}_${projectId.toString()}`,
      },
    )
    this.scheduleInterval = opts.scheduleIntervalMs ?? HOUR
    this.uncertaintyBuffer = opts.uncertaintyBuffer ?? 0

    activityConfig
      .labels({
        project: this.projectId.toString(),
        scheduleIntervalMs: this.scheduleInterval,
        uncertaintyBuffer: this.uncertaintyBuffer,
        batchSize: this.opts.batchSize,
      })
      .set(1)
  }

  async start(): Promise<void> {
    this.logger.info('Started')
    await this.loadState()
    this.processQueue.addIfEmpty()
    this.refreshId = setInterval(() => {
      this.processQueue.addIfEmpty()
    }, this.scheduleInterval)
  }

  async stop(): Promise<void> {
    this.logger.info('Stopping')
    clearInterval(this.refreshId)
    await this.processQueue.waitTillEmpty()
  }

  hasProcessedAll(): boolean {
    return (
      this.state !== undefined && this.state.lastProcessed === this.state.latest
    )
  }

  onProcessedAll(listener: () => void): void {
    this.on(ALL_PROCESSED_EVENT, listener)
  }

  getStatus() {
    return {
      latest: this.state?.latest ?? null,
      lastProcessed: this.state?.lastProcessed ?? null,
      syncedOnce: this.state?.syncedOnce ?? false,
      isProcessing: !this.processQueue.isEmpty(),
    }
  }

  private async process(): Promise<void> {
    this.logger.info('Processing started')

    let firstRun = true
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    processing: while (true) {
      let lastProcessed = this.state?.lastProcessed
      // we need to adjust starting block if its first run and uncertaintyBuffer is set
      if (firstRun && lastProcessed && this.uncertaintyBuffer > 0) {
        lastProcessed -= this.uncertaintyBuffer
      }
      const startFrom = this.opts.startFrom
      let from = lastProcessed ? lastProcessed + 1 : startFrom

      const previousLatest = this.state?.latest ?? startFrom
      const latest = await this.getLatest(previousLatest)
      this.logger.info('Fetched latest block', {
        latest,
        previousLatest,
        startFrom,
        from,
      })

      if (from === latest + 1) {
        break processing
      }

      assert(
        from <= latest,
        `getLatest returned sequence member that was already processed. from=${from}, latest=${latest}`,
      )

      for (; from <= latest; from += this.opts.batchSize) {
        const to = Math.min(from + this.opts.batchSize - 1, latest)
        this.logger.info('Processing range started', { from, to })
        await this.repository.runInTransaction(async (trx) => {
          await this.processRange(from, to, trx)
          await this.setState(
            {
              lastProcessed: to,
              latest,
              syncedOnce: !!this.state?.syncedOnce || to === latest,
            },
            trx,
          )
        })
        this.logger.info('Processing range finished', { from, to })
      }
      firstRun = false
    }

    this.logger.info('Processing finished')
    this.emit(ALL_PROCESSED_EVENT)
  }

  private async loadState(): Promise<void> {
    const state = await this.repository.findById(this.projectId.toString())
    this.state = state
  }

  private async setState(state: State, trx?: Knex.Transaction): Promise<void> {
    await this.repository.addOrUpdate(
      {
        id: this.projectId.toString(),
        ...state,
      },
      trx,
    )
    activityLast
      .labels({ project: this.projectId.toString() })
      .set(state.lastProcessed)
    activityLatest
      .labels({ project: this.projectId.toString() })
      .set(state.latest)
    this.state = state
  }

  /**
   * WARNING: this method should be used only in tests
   */
  _TEST_ONLY_stopQueue(): void {
    this.processQueue._TEST_ONLY_stop()
    this.processQueue._TEST_ONLY_clear()
  }
}
