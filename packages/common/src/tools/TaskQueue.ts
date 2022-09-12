import assert from 'assert'

import { Logger } from './Logger'

export class TaskQueue<T> {
  private queue: T[] = []
  private busyWorkers = 0

  constructor(
    private executeTask: (task: T) => Promise<void>,
    private logger: Logger,
    private workers = 1,
  ) {
    assert(
      workers > 0 && Number.isInteger(workers),
      'workers needs to be a positive integer',
    )
  }

  private get isEmpty() {
    return this.queue.length === 0 && this.busyWorkers === 0
  }

  private get allWorkersBusy() {
    return this.busyWorkers === this.workers
  }

  addIfEmpty(task: T) {
    if (!this.isEmpty) {
      return
    }
    this.addToBack(task)
  }

  addToFront(task: T) {
    this.queue.unshift(task)
    setTimeout(() => this.execute())
  }

  addToBack(task: T) {
    this.queue.push(task)
    setTimeout(() => this.execute())
  }

  private execute() {
    this.executeUnchecked().catch((e) => {
      this.logger.error(e)
    })
  }

  private async executeUnchecked() {
    if (this.allWorkersBusy || this.queue.length === 0) {
      return
    }
    this.busyWorkers++
    const task = this.queue.shift() as T
    try {
      await this.executeTask(task)
    } catch (error) {
      this.logger.error(error)
      this.queue.unshift(task)
    } finally {
      this.busyWorkers--
      setTimeout(() => this.execute())
    }
  }
}
