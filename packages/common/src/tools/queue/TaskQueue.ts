import { json } from '@l2beat/types'
import assert from 'assert'
import { setTimeout as wait } from 'timers/promises'

import { EventTracker } from '../EventTracker'
import { getErrorMessage, Logger } from '../Logger'
import { Retries } from './Retries'
import { Job, ShouldRetry, TaskQueueOpts } from './types'

const DEFAULT_RETRY = Retries.exponentialBackOff(100, {
  maxDistanceMs: 3_000,
})

/**
 * Note: by default, queue will retry tasks using exponential back off strategy (failing tasks won't be dropped).
 */
export class TaskQueue<T> {
  private readonly queue: Job<T>[] = []
  private busyWorkers = 0
  private readonly workers: number
  private readonly shouldRetry: ShouldRetry<T>
  private readonly eventTracker?: EventTracker<
    'started' | 'success' | 'error' | 'retry'
  >

  constructor(
    private readonly executeTask: (task: T) => Promise<void>,
    private readonly logger: Logger,
    opts?: TaskQueueOpts<T>,
  ) {
    this.workers = opts?.workers ?? 1
    assert(
      this.workers > 0 && Number.isInteger(this.workers),
      'workers needs to be a positive integer',
    )
    this.shouldRetry = opts?.shouldRetry ?? DEFAULT_RETRY
    if (opts?.trackEvents) {
      this.eventTracker = new EventTracker()
    }
  }

  get length() {
    return this.queue.length
  }

  addIfEmpty(task: T) {
    if (!this.isEmpty()) {
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

  async waitTilEmpty() {
    while (!this.isEmpty()) {
      await wait(100)
    }
  }

  getStats(): json {
    return {
      busyWorkers: this.busyWorkers,
      queuedTasks: this.queue.length,
      events: this.eventTracker?.getStats() ?? null,
    }
  }

  private isEmpty() {
    return this.queue.length === 0 && this.busyWorkers === 0
  }

  private allWorkersBusy() {
    return this.busyWorkers === this.workers
  }

  private execute() {
    this.executeUnchecked().catch((e) => {
      // this should never happen
      this.logger.error(
        { message: '[CRITICAL] Error during executeUnchecked' },
        e,
      )
    })
  }

  private shouldExecute(job: Job<T>): boolean {
    return Date.now() >= job.executeAt
  }

  private handleFailure(job: Job<T>, error: unknown) {
    job.attempts++
    const result = this.shouldRetry(job, error)
    if (!result.retry) {
      this.logger.error(
        {
          message: 'No more retries',
          job: JSON.stringify(job),
        },
        error,
      )
      this.eventTracker?.record('error')
      return
    }
    job.executeAt = Date.now() + (result.executeAfter ?? 0)
    this.queue.unshift(job)
    this.logger.info({
      message: 'Scheduled retry',
      job: JSON.stringify(job),
    })
    this.eventTracker?.record('retry')
  }

  private earliestScheduledExecution() {
    return this.queue.map((j) => j.executeAt).sort()[0]
  }

  private async executeUnchecked() {
    if (this.allWorkersBusy() || this.queue.length === 0) {
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
      this.logger.debug('Executing job', { job: JSON.stringify(job) })
      this.eventTracker?.record('started')
      await this.executeTask(job.task)
      this.eventTracker?.record('success')
    } catch (error) {
      this.logger.warn('Error during task execution', {
        job: JSON.stringify(job),
        error: getErrorMessage(error),
      })
      this.handleFailure(job, error)
    } finally {
      this.busyWorkers--
      setTimeout(() => this.execute())
    }
  }
}
