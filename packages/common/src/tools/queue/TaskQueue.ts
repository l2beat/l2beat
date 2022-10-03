import assert from 'assert'

import { Logger } from '../Logger'
import { Retries } from './Retries'
import { Job, ShouldRetry, TaskQueueOpts } from './types'

export class TaskQueue<T> {
  private queue: Job<T>[] = []
  private busyWorkers = 0
  readonly workers: number
  private shouldRetry: ShouldRetry<T>

  constructor(
    private executeTask: (task: T) => Promise<void>,
    private logger: Logger,
    opts?: TaskQueueOpts<T>,
  ) {
    this.workers = opts?.workers ?? 1
    assert(
      this.workers > 0 && Number.isInteger(this.workers),
      'workers needs to be a positive integer',
    )
    this.shouldRetry = opts?.shouldRetry ?? Retries.always
  }

  private get isEmpty() {
    return this.queue.length === 0 && this.busyWorkers === 0
  }

  private get allWorkersBusy() {
    return this.busyWorkers === this.workers
  }

  get length() {
    return this.queue.length
  }

  getBusyWorkers() {
    return this.busyWorkers
  }

  addIfEmpty(task: T) {
    if (!this.isEmpty) {
      return
    }
    this.addToBack(task)
  }

  addToFront(task: T) {
    this.queue.unshift({ task, attempts: 0, executeAt: Date.now() })
    setTimeout(() => this.execute())
  }

  addToBack(task: T) {
    this.queue.push({ task, attempts: 0, executeAt: Date.now() })
    setTimeout(() => this.execute())
  }

  private execute() {
    this.executeUnchecked().catch((e) => {
      this.logger.error(e)
    })
  }

  private shouldExecute(job: Job<T>): boolean {
    return Date.now() >= job.executeAt
  }

  private handleFailure(job: Job<T>) {
    job.attempts++
    const result = this.shouldRetry(job)
    if (!result.retry) {
      return
    }
    job.executeAt = Date.now() + (result.executeAfter ?? 0)
    this.queue.unshift(job)
  }

  private earliestScheduledExecution() {
    return this.queue.map((j) => j.executeAt).sort()[0]
  }

  private async executeUnchecked() {
    if (this.allWorkersBusy || this.queue.length === 0) {
      return
    }
    const jobIndex = this.queue.findIndex((job) => this.shouldExecute(job))
    if (jobIndex === -1) {
      const nextTimestamp = this.earliestScheduledExecution()
      setTimeout(() => this.execute(), nextTimestamp - Date.now())
      return
    }
    this.busyWorkers++
    const job = this.queue.splice(jobIndex, 1)[0]
    try {
      await this.executeTask(job.task)
    } catch (error) {
      this.logger.error(error)
      this.handleFailure(job)
    } finally {
      this.busyWorkers--
      setTimeout(() => this.execute())
    }
  }
}
