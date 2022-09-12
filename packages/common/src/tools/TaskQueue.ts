import assert from 'assert'

import { Logger } from './Logger'

export class TaskQueue<T> {
  private queue: T[] = []

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

  private get allWorkersBusy() {
    return this.workers === 0
  }

  addIfEmpty(task: T) {
    if (this.queue.length === 0 && !this.allWorkersBusy) {
      this.addToBack(task)
    }
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
    this.workers--
    const task = this.queue.shift() as T
    try {
      await this.executeTask(task)
    } catch (error) {
      this.logger.error(error)
      this.queue.unshift(task)
    } finally {
      this.workers++
      setTimeout(() => this.execute())
    }
  }
}
