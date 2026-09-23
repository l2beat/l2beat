export class TimePredictor {
  private totalSeconds = 0
  private completed = 0

  update(durationSeconds: number): void {
    this.totalSeconds += durationSeconds
    this.completed += 1
  }

  predict(remainingTasks: number): number | undefined {
    if (this.completed === 0) {
      return undefined
    }
    return (this.totalSeconds / this.completed) * remainingTasks
  }
}
