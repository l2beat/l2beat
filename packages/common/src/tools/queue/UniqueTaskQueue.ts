import { Logger } from '../Logger'
import { TaskQueue } from './TaskQueue'
import { TaskQueueOpts } from './types'

export class UniqueTaskQueue<T extends string | number> extends TaskQueue<T> {
  private taskSet = new Set<T>()

  constructor(
    executeTask: (task: T) => Promise<void>,
    logger: Logger,
    opts?: TaskQueueOpts<T>,
  ) {
    const wrappedExecute = async (task: T) => {
      await executeTask(task)
      this.taskSet.delete(task)
    }

    super(wrappedExecute, logger, opts)
  }

  override addIfEmpty(task: T): void {
    this.addUnique(task, super.addIfEmpty.bind(this))
  }

  override addToBack(task: T): void {
    this.addUnique(task, super.addToBack.bind(this))
  }

  override addToFront(task: T): void {
    this.addUnique(task, super.addToFront.bind(this))
  }

  private addUnique(task: T, method: (task: T) => void) {
    if (!this.taskSet.has(task)) {
      this.taskSet.add(task)
      method(task)
    }
  }
}
