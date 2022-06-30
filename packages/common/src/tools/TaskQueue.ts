import { Logger } from './Logger'

export class TaskQueue<T> {
  private queue: T[] = []
  private isExecuting = false

  constructor(
    private executeTask: (task: T) => Promise<void>,
    private logger: Logger,
  ) {}

  addIfEmpty(task: T) {
    if (this.queue.length === 0 && !this.isExecuting) {
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
    if (this.isExecuting || this.queue.length === 0) {
      return
    }
    const task = this.queue.shift() as T
    this.isExecuting = true
    try {
      await this.executeTask(task)
    } catch (error) {
      this.logger.error(error)
      this.queue.unshift(task)
    } finally {
      this.isExecuting = false
      setTimeout(() => this.execute())
    }
  }
}
