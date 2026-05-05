export class TimePredictor {
  private totalSeconds = 0
  private completed = 0

  updateAndPredict(duration: number, remainingTasks: number): number {
    this.totalSeconds += duration
    this.completed += 1
    return (this.totalSeconds / this.completed) * remainingTasks
  }
}
