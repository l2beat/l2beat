import { assert, Logger, Retries, TaskQueue } from '@l2beat/common'
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

  private async process(): Promise<void> {
    this.logger.debug('Processing started')

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    processing: while (true) {
      const lastProcessed = this.state?.lastProcessed

      this.logger.debug('Calling getLatest', {
        lastProcessed: lastProcessed ?? null,
        startFrom: this.opts.startFrom,
      })
      const to = await this.opts.getLatest(lastProcessed ?? this.opts.startFrom)

      if ((lastProcessed ?? this.opts.startFrom - 1) === to) {
        if (!this.state) {
          await this.setState({
            lastProcessed: lastProcessed ?? this.opts.startFrom,
            latest: to,
          })
        }
        break processing
      }
      // to avoid processing lastSynced multiple times we need to increment it by one
      let from = lastProcessed ? lastProcessed + 1 : this.opts.startFrom

      assert(
        from <= to,
        `getLatest returned sequence member that was already processed. from=${from}, to=${to}`,
      )

      for (; from <= to; from += this.opts.batchSize) {
        await this.processRange(
          from,
          Math.min(from + this.opts.batchSize - 1, to),
          to,
        )
      }
    }

    this.logger.debug('Processing finished')
    this.emit(ALL_PROCESSED_EVENT)
  }

  private async processRange(from: number, to: number, latest: number) {
    this.logger.debug('Processing range started', { from, to })
    await this.repository.runInTransaction(async (trx) => {
      await this.opts.processRange(from, to, trx)
      await this.setState({ lastProcessed: to, latest }, trx)
    })
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
