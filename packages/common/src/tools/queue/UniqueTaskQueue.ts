import { TaskQueue } from './TaskQueue'

export class UniqueTaskQueue<T extends string | number> extends TaskQueue<T> {
  private taskSet: Set<T> = new Set()

  addIfEmpty(task: T): void {
    this.addUnique(task, super.addIfEmpty.bind(this))
  }

  addToBack(task: T): void {
    this.addUnique(task, super.addToBack.bind(this))
  }

  addToFront(task: T): void {
    this.addUnique(task, super.addToFront.bind(this))
  }

  private addUnique(task: T, method: (task: T) => void) {
    if (!this.taskSet.has(task)) {
      this.taskSet.add(task)
      method(task)
    }
  }
}
