import { Logger } from './Logger'

export interface Job {
  name: string
  execute: () => Promise<void>
}

interface JobInQueue extends Job {
  failureCount: number
}

export interface JobQueueOptions {
  maxConcurrentJobs: number
}

export class JobQueue {
  private queue: JobInQueue[] = []
  private inProgress: JobInQueue[] = []
  private lastUpdatedAt = new Date().toISOString()

  constructor(private options: JobQueueOptions, private logger: Logger) {}

  add(job: Job) {
    this.queue.push({ ...job, failureCount: 0 })
    setTimeout(() => this.execute())
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

  private execute() {
    this.executeUnchecked().catch((e) => {
      this.logger.error(e)
    })
  }

  private async executeUnchecked() {
    this.lastUpdatedAt = new Date().toISOString()
    if (this.inProgress.length >= this.options.maxConcurrentJobs) {
      return
    }
    const job = this.queue.shift()
    if (!job) {
      return
    }

    this.inProgress.push(job)
    setTimeout(() => this.execute())

    try {
      await job.execute()
      this.inProgress.splice(this.inProgress.indexOf(job), 1)
    } catch (error) {
      this.logger.error(error)
      this.inProgress.splice(this.inProgress.indexOf(job), 1)
      this.queue.unshift({ ...job, failureCount: job.failureCount + 1 })
    } finally {
      setTimeout(() => this.execute())
    }
  }
}
