import { EventTracker, Logger } from '@l2beat/shared'
import {
  getErrorMessage,
  getErrorStackTrace,
  json,
  Retries,
  ShouldRetry,
  wrapAndMeasure,
} from '@l2beat/shared-pure'
import assert from 'assert'
import { Histogram } from 'prom-client'
import { setTimeout as wait } from 'timers/promises'

const DEFAULT_RETRY = Retries.exponentialBackOff({
  stepMs: 100,
  maxDistanceMs: 3_000,
  maxAttempts: 10,
})

type Task<T> = (task: T) => Promise<void>
interface Job<T> {
  task: T
  attempts: number
  executeAt: number
}

const taskQueueHistogram = new Histogram<string>({
  name: 'task_queue_task_execution_duration_histogram',
  help: 'Histogram showing TaskQueue sync duration',
  buckets: [0.25, 0.5, 1, 2.5, 5, 10, 25, 50],
  labelNames: ['id'],
})

export type TaskQueueEventTracker = EventTracker<
  'started' | 'success' | 'error' | 'retry'
>

export interface TaskQueueOpts<T> {
  workers?: number
  shouldRetry?: ShouldRetry<T>
  eventTracker?: TaskQueueEventTracker
  metricsId: string
  shouldHaltAfterFailedRetries?: boolean
}
/**
 * Note: by default, queue will retry failing tasks finite number of times using exponential back off strategy and halt if error persists.
 * This can be customized by changing `shouldRetry` function and `shouldHaltAfterFailedRetries` parameter.
 */
export class TaskQueue<T> {
  private readonly executeTask: Task<T>
  private readonly queue: Job<T>[] = []
  private busyWorkers = 0
  private readonly workers: number
  private readonly shouldRetry: ShouldRetry<T>
  private readonly eventTracker?: TaskQueueEventTracker
  private readonly shouldHaltAfterFailedRetries
  private halted = false

  constructor(
    executeTask: Task<T>,
    private readonly logger: Logger,
    opts: TaskQueueOpts<T>,
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
    this.shouldHaltAfterFailedRetries =
      opts.shouldHaltAfterFailedRetries ?? true

    this.executeTask = wrapAndMeasure(executeTask, {
      histogram: taskQueueHistogram,
      labels: {
        id: opts.metricsId,
      },
    })
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

  isHalted(): boolean {
    return this.halted
  }

  isEmpty(): boolean {
    return this.queue.length === 0 && this.busyWorkers === 0
  }

  private allWorkersBusy() {
    return this.busyWorkers === this.workers
  }

  private execute() {
    if (this.halted) {
      this.logger.debug("Queue is halted, won't execute")
      return
    }

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
      this.eventTracker?.record('error')
      if (this.shouldHaltAfterFailedRetries) {
        this.logger.error(
          {
            message: 'Halting queue because of error',
            job: JSON.stringify(job),
          },
          error,
        )
        this.halted = true
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
}
