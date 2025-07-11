import type { Logger } from '@l2beat/backend-tools'
import type { EventTracker } from '@l2beat/shared'
import {
  assert,
  getErrorMessage,
  getErrorStackTrace,
  type json,
  Retries,
  type ShouldRetry,
} from '@l2beat/shared-pure'
import { setTimeout as wait } from 'timers/promises'

const ONE_HOUR = 1 * 60 * 60000
const DEFAULT_RETRY = Retries.exponentialBackOff({
  stepMs: 1000, // 2s 4s 8s 16s 32s 64s 128s 256s 512s 1024s...
  maxAttempts: Number.POSITIVE_INFINITY, // never stop the queue
  maxDistanceMs: ONE_HOUR,
  notifyAfterAttempts: 10, // sum = 2046s minutes = 34 minutes
})

type Task<T> = (task: T) => Promise<void>
interface Job<T> {
  task: T
  attempts: number
  executeAt: number
}

export type TaskQueueEventTracker = EventTracker<
  'started' | 'success' | 'error' | 'retry'
>

export interface TaskQueueOpts {
  workers?: number
  shouldRetry?: ShouldRetry
  eventTracker?: TaskQueueEventTracker
  metricsId: string
  shouldStopAfterFailedRetries?: boolean
}
/**
 * Note: by default, queue will retry failing tasks finite number of times using exponential back off strategy and stop if error persists.
 * This can be customized by changing `shouldRetry` function and `shouldStopAfterFailedRetries` parameter.
 */
export class TaskQueue<T> {
  private readonly queue: Job<T>[] = []
  private busyWorkers = 0
  private readonly workers: number
  private readonly shouldRetry: ShouldRetry
  private readonly eventTracker?: TaskQueueEventTracker
  private readonly shouldStopAfterFailedRetries
  private stopped = false

  constructor(
    private readonly executeTask: Task<T>,
    private readonly logger: Logger,
    opts: TaskQueueOpts,
  ) {
    this.workers = opts.workers ?? 1
    assert(
      this.workers > 0 && Number.isInteger(this.workers),
      'workers needs to be a positive integer',
    )
    this.shouldRetry = opts.shouldRetry ?? DEFAULT_RETRY
    if (opts.eventTracker) {
      this.eventTracker = opts.eventTracker
    }
    this.shouldStopAfterFailedRetries =
      opts.shouldStopAfterFailedRetries ?? true
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

  async waitTillEmpty() {
    while (!this.isEmpty()) {
      await wait(100)
    }
  }

  getStatus(): json {
    return {
      busyWorkers: this.busyWorkers,
      queuedTasks: this.queue.length,
      events: this.eventTracker?.getStatus() ?? null,
    }
  }

  isStopped(): boolean {
    return this.stopped
  }

  isEmpty(): boolean {
    return this.queue.length === 0 && this.busyWorkers === 0
  }

  private allWorkersBusy() {
    return this.busyWorkers === this.workers
  }

  private execute() {
    if (this.stopped) {
      this.logger.debug("Queue is stopped, won't execute")
      return
    }

    this.executeUnchecked().catch((e) => {
      // this should never happen
      this.logger.error('[CRITICAL] Error during executeUnchecked', e)
    })
  }

  private shouldExecute(job: Job<T>): boolean {
    return Date.now() >= job.executeAt
  }

  private handleFailure(job: Job<T>, error: unknown) {
    job.attempts++
    const result = this.shouldRetry(job.attempts, error)

    if (result.notify) {
      this.logger.error(error, { job })
    }

    if (result.shouldStop) {
      this.eventTracker?.record('error')
      if (this.shouldStopAfterFailedRetries) {
        // TODO: new logger usage
        this.logger.error('Stopping queue because of error', {
          job,
          error,
        })
        this.stopped = true
      }
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
        stack: getErrorStackTrace(error),
      })
      this.handleFailure(job, error)
    } finally {
      this.busyWorkers--
      setTimeout(() => this.execute())
    }
  }

  /**
   * WARNING: this method should be used only in tests
   */
  _TEST_ONLY_stop() {
    this.stopped = true
  }

  /**
   * WARNING: this method should be used only in tests
   */
  _TEST_ONLY_clear() {
    this.queue.splice(0, this.queue.length)
  }
}
