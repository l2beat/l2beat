import { Logger, Retries, TaskQueue } from '@l2beat/common'
import { range } from 'lodash'

export class BatchDownloader<T> {
  queue: TaskQueue<number>
  batch: T[] = []

  constructor(
    private readonly batchSize: number,
    private readonly getOne: (number: number) => Promise<T>,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    this.queue = new TaskQueue<number>(
      this.getOneAndAddToBatch.bind(this),
      this.logger,
      {
        trackEvents: true,
        workers: this.batchSize,
        shouldRetry: Retries.exponentialBackOff(100, {
          maxDistance: 3_000,
          maxAttempts: 8,
        }),
      },
    )
  }

  async download(from: number, to: number): Promise<T[]> {
    this.batch = []
    await this.queue.waitTilEmpty()
    range(from, to + 1).forEach((number) => this.queue.addToBack(number))
    await this.queue.waitTilEmpty()
    return this.batch
  }

  private async getOneAndAddToBatch(number: number): Promise<void> {
    const result = await this.getOne(number)
    this.batch.push(result)
  }
}
