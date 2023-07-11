/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Logger } from '@l2beat/backend-tools'

export interface Job {
  readonly name: string
  readonly execute: () => Promise<void>
  readonly maxRetries?: number
}

interface JobInQueue extends Job {
  failureCount: number
}

export interface JobQueueOptions {
  maxConcurrentJobs: number
}

export class JobQueue {
  private readonly queue: JobInQueue[] = []
  private readonly inProgress: JobInQueue[] = []
  private lastUpdatedAt = new Date().toISOString()

  constructor(
    private readonly options: JobQueueOptions,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  add(job: Job) {
    this.queue.push({ ...job, failureCount: 0 })
    setTimeout(() => void this.execute())
  }

  getStats() {
    return {
      lastUpdatedAt: this.lastUpdatedAt,
      jobsInProgress: this.inProgress.length,
      jobsInQueue: this.queue.length,
      recentFailureCount:
        this.inProgress.reduce((count, job) => count + job.failureCount, 0) +
        (this.queue[0]?.failureCount ?? 0),
    }
  }

  getTotalJobs() {
    return this.inProgress.length + this.queue.length
  }

  private async execute() {
    this.lastUpdatedAt = new Date().toISOString()
    if (this.inProgress.length >= this.options.maxConcurrentJobs) {
      return
    }
    const job = this.queue.shift()
    if (!job) {
      return
    }

    this.inProgress.push(job)
    setTimeout(() => void this.execute())

    try {
      await job.execute()
      this.inProgress.splice(this.inProgress.indexOf(job), 1)
    } catch (error) {
      this.inProgress.splice(this.inProgress.indexOf(job), 1)

      const shouldRetry = job.failureCount < (job.maxRetries ?? Infinity)

      if (shouldRetry) {
        this.queue.unshift({ ...job, failureCount: job.failureCount + 1 })
      }

      if (shouldRetry && job.maxRetries) {
        const { message, stack = '' } = makeError(error)
        this.logger.debug(
          `Retrying job "${job.name}" due to ${message}${
            stack ? ' ' + stack : ''
          }`,
        )
      } else {
        this.logger.error(`Job "${job.name}" failed with:`, error)
      }
    } finally {
      setTimeout(() => void this.execute())
    }
  }
}

function makeError(error: unknown) {
  return error instanceof Error ? error : new Error(JSON.stringify(error))
}
