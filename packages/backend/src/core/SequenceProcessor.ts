import {
  assert,
  EventTracker,
  Logger,
  Retries,
  TaskQueue,
} from '@l2beat/common'
import { json } from '@l2beat/types'
import { Knex } from 'knex'
import { EventEmitter } from 'stream'

import { SequenceProcessorRepository } from '../peripherals/database/SequenceProcessorRepository'

export interface SequenceProcessorOpts {
  startFrom: number
  batchSize: number
  getLatest: (previousLatest: number) => Promise<number> | number
  processRange: (
    // [from, to] <- ranges are inclusive
    from: number,
    to: number,
    trx: Knex.Transaction,
  ) => Promise<void>
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
        shouldRetry: Retries.exponentialBackOff(100, {
          maxDistanceMs: 3_000,
          maxAttempts: 10,
        }),
      },
    )
    this.scheduleInterval = opts.scheduleIntervalMs ?? HOUR
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
    await this.processQueue.waitTilEmpty()
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

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    processing: while (true) {
      const lastProcessed = this.state?.lastProcessed
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
        if (!this.state) {
          await this.setState({
            lastProcessed: latest,
            latest,
          })
        }
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
    }

    this.logger.debug('Processing finished')
    this.emit(ALL_PROCESSED_EVENT)
  }

  private async processRange(from: number, to: number, latest: number) {
    this.logger.debug('Processing range started', { from, to })
    try {
      this.eventTracker.record('range started')
      await this.repository.runInTransaction(async (trx) => {
        await this.opts.processRange(from, to, trx)
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
    const state = await this.repository.getById(this.id)
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
    this.state = state
  }
}
