import { Logger, Retries, TaskQueue } from '@l2beat/common'
import { assert } from '@l2beat/common/src/tools/assert'
import { Knex } from 'knex'
import { EventEmitter } from 'stream'

import { SequenceProcessorRepository } from '../peripherals/database/SequenceProcessorRepository'

export interface SequenceProcessorOpts {
  id: string
  logger: Logger
  repository: SequenceProcessorRepository
  startFrom: number
  batchSize: number
  getLast: (previousLast: number) => Promise<number>
  processRange: (
    // [from, to] <- ranges are inclusive
    from: number,
    to: number,
    trx: Knex.Transaction,
  ) => Promise<void>
  scheduleIntervalMs?: number
}

export const ALL_PROCESSED_EVENT = 'Last reached'

const HOUR = 1000 * 60 * 60

export class SequenceProcessor extends EventEmitter {
  readonly id: string
  private readonly processQueue: TaskQueue<void>
  private readonly scheduleInterval: number
  private readonly logger: Logger
  private lastReached = false
  private refreshId: NodeJS.Timer | undefined

  constructor(private readonly opts: SequenceProcessorOpts) {
    super()

    assert(opts.batchSize > 0)

    this.id = this.opts.id
    this.logger = this.opts.logger.for(`${SequenceProcessor.name}.${this.id}`)
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

  public start(): void {
    this.logger.info('Started')
    this.processQueue.addIfEmpty()
    this.refreshId = setInterval(
      () => this.processQueue.addIfEmpty(),
      this.scheduleInterval,
    )
  }

  public async stop(): Promise<void> {
    this.logger.info('Stopping')
    clearInterval(this.refreshId)
    await this.processQueue.waitTilEmpty()
  }

  isLastReached(): boolean {
    return this.lastReached
  }

  private async process(): Promise<void> {
    this.logger.debug('Processing started')

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    processing: while (true) {
      const lastProcessed = (await this.opts.repository.getById(this.id))
        ?.lastProcessed
      this.logger.debug('Calling getLast')
      const to = await this.opts.getLast(lastProcessed ?? this.opts.startFrom)

      if ((lastProcessed ?? this.opts.startFrom) === to) {
        break processing
      }
      // to avoid processing lastSynced multiple times we need to increment it by one
      let from = lastProcessed ? lastProcessed + 1 : this.opts.startFrom

      assert(
        from <= to,
        `getLast returned sequence member that was already processed. from=${from}, to=${to}`,
      )

      for (; from <= to; from += this.opts.batchSize) {
        await this.processRange(
          from,
          Math.min(from + this.opts.batchSize - 1, to),
        )
      }
    }

    this.logger.debug('Processing finished')
    this.lastReached = true
    this.emit(ALL_PROCESSED_EVENT)
  }

  private async processRange(from: number, to: number) {
    this.logger.debug('Processing range started', { from, to })
    await this.opts.repository.runInTransaction(async (trx) => {
      await this.opts.processRange(from, to, trx)
      await this.opts.repository.addOrUpdate(
        { id: this.id, lastProcessed: to },
        trx,
      )
    })
    this.logger.debug('Processing range finished', { from, to })
  }
}
