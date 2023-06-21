import { EventTracker, Logger } from '@l2beat/shared'
import { assert, json } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { Gauge } from 'prom-client'
import { EventEmitter } from 'stream'

import { SequenceProcessorRepository } from '../peripherals/database/SequenceProcessorRepository'
import { TaskQueue } from './queue/TaskQueue'

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
  getLatest: (previousLatest: number) => Promise<number> | number
  processRange: (
    // [from, to] <- ranges are inclusive
    from: number,
    to: number,
    trx: Knex.Transaction,
    logger: Logger, // logger with properly set name
  ) => Promise<void>
  uncertaintyBuffer?: number // resync from lastProcessed - uncertaintyBuffer
  scheduleIntervalMs?: number
}

export const ALL_PROCESSED_EVENT = 'All processed'

export type SequenceProcessorStatus = Record<
  | 'latest'
  | 'lastProcessed'
  | 'scheduleIntervalMs'
  | 'isProcessing'
  | 'batchSize'
  | 'events'
  | 'processedLastFiveSeconds',
  json
>

const HOUR = 1000 * 60 * 60

interface State {
  latest: number
  lastProcessed: number
}

export class SequenceProcessor extends EventEmitter {
  private readonly processQueue: TaskQueue<void>
  private readonly scheduleInterval: number
  private readonly uncertaintyBuffer: number
  private readonly logger: Logger
  private state?: State
  private refreshId: NodeJS.Timer | undefined
  private readonly eventTracker = new EventTracker<
    'range started' | 'range succeeded' | 'range failed'
  >()

  constructor(
    readonly id: string,
    logger: Logger,
    private readonly repository: SequenceProcessorRepository,
    private readonly opts: SequenceProcessorOpts,
  ) {
    super()

    assert(opts.batchSize > 0)

    this.logger = logger.for(`${SequenceProcessor.name}[${this.id}]`)
    this.processQueue = new TaskQueue<void>(
      () => this.process(),
      this.logger.for('updateQueue'),
      {
        metricsId: `${SequenceProcessor.name}_${id}`,
      },
    )
    this.scheduleInterval = opts.scheduleIntervalMs ?? HOUR
    this.uncertaintyBuffer = opts.uncertaintyBuffer ?? 0
    activityConfig
      .labels({
        project: this.id,
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
    this.refreshId = setInterval(
      () => this.processQueue.addIfEmpty(),
      this.scheduleInterval,
    )
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

  getStatus(): SequenceProcessorStatus {
    const events = this.eventTracker.getStatus()
    return {
      latest: this.state?.latest ?? null,
      lastProcessed: this.state?.lastProcessed ?? null,
      scheduleIntervalMs: this.scheduleInterval,
      isProcessing: !this.processQueue.isEmpty(),
      batchSize: this.opts.batchSize,
      processedLastFiveSeconds:
        events.lastFiveSeconds['range succeeded'] * this.opts.batchSize,
      events,
    }
  }

  private async process(): Promise<void> {
    this.logger.debug('Processing started')

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
      this.logger.debug('Calling getLatest', {
        previousLatest,
        startFrom,
        from,
      })
      const latest = await this.opts.getLatest(previousLatest)

      if (from === latest + 1) {
        break processing
      }

      assert(
        from <= latest,
        `getLatest returned sequence member that was already processed. from=${from}, latest=${latest}`,
      )

      for (; from <= latest; from += this.opts.batchSize) {
        const to = Math.min(from + this.opts.batchSize - 1, latest)
        await this.processRange(from, to, latest)
      }
      firstRun = false
    }

    this.logger.debug('Processing finished')
    this.emit(ALL_PROCESSED_EVENT)
  }

  private async processRange(from: number, to: number, latest: number) {
    this.logger.debug('Processing range started', { from, to })
    try {
      this.eventTracker.record('range started')
      await this.repository.runInTransaction(async (trx) => {
        await this.opts.processRange(from, to, trx, this.logger)
        await this.setState({ lastProcessed: to, latest }, trx)
      })
      this.eventTracker.record('range succeeded')
    } catch (error) {
      this.eventTracker.record('range failed')
      throw error
    }
    this.logger.debug('Processing range finished', { from, to })
  }

  private async loadState(): Promise<void> {
    const state = await this.repository.findById(this.id)
    this.state = state
  }

  private async setState(state: State, trx?: Knex.Transaction): Promise<void> {
    await this.repository.addOrUpdate(
      {
        id: this.id,
        ...state,
      },
      trx,
    )
    activityLast.labels({ project: this.id }).set(state.lastProcessed)
    activityLatest.labels({ project: this.id }).set(state.latest)
    this.state = state
  }
}
