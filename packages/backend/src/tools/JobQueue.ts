import { Logger } from './Logger'

export interface Job {
  name: string
  execute: () => Promise<void>
}

interface JobInQueue extends Job {
  failureCount: number
}

export interface JobQueueStats {
  jobsInProgress: { name: string; failureCount: number }[]
  nextInQueue: { name: string; failureCount: number } | undefined
  lastInQueue: { name: string; failureCount: number } | undefined
  totalJobs: number
}

export interface JobQueueOptions {
  maxConcurrentJobs: number
}

export class JobQueue {
  private queue: JobInQueue[] = []
  private inProgress: JobInQueue[] = []

  constructor(private options: JobQueueOptions, private logger: Logger) {}

  add(job: Job) {
    this.queue.push({ ...job, failureCount: 0 })
    setTimeout(() => this.execute())
  }

  getStats(): JobQueueStats {
    const first = this.queue[0]
    const last = this.queue[this.queue.length - 1]
    return {
      jobsInProgress: this.inProgress.map((x) => ({
        name: x.name,
        failureCount: x.failureCount,
      })),
      nextInQueue: first && {
        name: first.name,
        failureCount: first.failureCount,
      },
      lastInQueue: last && { name: last.name, failureCount: last.failureCount },
      totalJobs: this.inProgress.length + this.queue.length,
    }
  }

  getTotalJobs() {
    return this.inProgress.length + this.queue.length
  }

  private async execute() {
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
