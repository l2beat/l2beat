import { Logger, TaskQueue } from '@l2beat/common'
import { Knex } from 'knex'
import { EventEmitter } from 'stream'
import { setTimeout } from 'timers/promises'

import { SequenceProcessorRepository } from '../peripherals/database/SequenceProcessorRepository'

interface SequenceProcessorOpts {
  id: string
  logger: Logger
  repository: SequenceProcessorRepository
  startFrom: number
  batchSize: number
  getLast: (previousLast: number) => Promise<number>
  processRange: (
    from: number,
    to: number,
    trx: Knex.Transaction,
  ) => Promise<void>
  scheduleIntervalMs?: number
}

const HOUR = 1000 * 60 * 60

export class SequenceProcessor extends EventEmitter {
  readonly id: string
  private readonly processQueue: TaskQueue<void>
  private readonly scheduleInterval: number
  private readonly logger: Logger
  private lastReached: boolean | undefined

  constructor(private readonly opts: SequenceProcessorOpts) {
    super()
    this.id = this.opts.id
    this.logger = this.opts.logger.for(`${SequenceProcessor.name}.${this.id}`)
    this.processQueue = new TaskQueue<void>(
      () => this.process(),
      this.logger.for('updateQueue'),
    )
    this.scheduleInterval = opts.scheduleIntervalMs ?? HOUR
  }

  start(): void {
    this.logger.info('Started')
    this.processQueue.addIfEmpty()
    setInterval(
      () => this.processQueue.addIfEmpty(),
      this.scheduleInterval,
    ).unref()
  }

  async isLastReached(): Promise<boolean> {
    while (this.lastReached === undefined) await setTimeout(50)
    return this.lastReached
  }

  private async process(): Promise<void> {
    this.logger.debug('Processing started')
    await this.repeatUntilLastReached(async (currentLast, tip) => {
      for (
        let from = tip ?? this.opts.startFrom;
        from < currentLast;
        from += this.opts.batchSize
      ) {
        const to = from + this.opts.batchSize - 1
        await this.processRange(from, to)
      }
    })
    this.logger.debug('Processing finished')
  }

  private async processRange(from: number, to: number) {
    this.logger.debug('Processing range started', { from, to })
    await this.opts.repository.runInTransaction(async (trx) => {
      await this.opts.processRange(from, to, trx)
      await this.opts.repository.addOrUpdate({ id: this.id, tip: to }, trx)
    })
    this.logger.debug('Processing range finished', { from, to })
  }

  private async repeatUntilLastReached(
    toRepeat: (last: number, tip?: number) => Promise<void>,
  ): Promise<void> {
    for (
      let tip = (await this.opts.repository.getById(this.id))?.tip,
        last = await this.opts.getLast(tip ?? this.opts.startFrom);
      !tip || tip < last;
      tip = last, last = await this.opts.getLast(last)
    ) {
      this.logger.debug('Last not reached', { last, tip: tip ?? null })
      this.lastReached = false
      await toRepeat(last, tip)
    }
    this.lastReached = true
    this.emit('last reached')
    this.logger.debug('Last reached')
  }
}
