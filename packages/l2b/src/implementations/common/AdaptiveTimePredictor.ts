export class AdaptiveTimePredictor {
  private durations: number[] = []
  private alpha = 0.4
  private ema: number | null = null

  updateAndPredict(duration: number, remainingTasks: number): number {
    let adjustedDuration = duration
    if (this.ema !== null && duration > 3 * this.ema) {
      adjustedDuration = this.ema + 0.3 * (duration - this.ema)
    }

    this.durations.push(adjustedDuration)

    if (this.ema === null) {
      this.ema = adjustedDuration
    } else {
      this.ema = this.alpha * adjustedDuration + (1 - this.alpha) * this.ema
    }

    if (this.durations.length >= 5) {
      const recentTrend = this.calculateRecentTrend()
      const predictedNext = Math.max(0, this.ema + recentTrend * 0.5)
      return predictedNext * remainingTasks
    }

    return this.ema * remainingTasks
  }

  private calculateRecentTrend(): number {
    const recent = this.durations.slice(-5)
    if (recent.length < 3) return 0

    const n = recent.length
    const indices = Array.from({ length: n }, (_, i) => i)

    const meanX = indices.reduce((a, b) => a + b) / n
    const meanY = recent.reduce((a, b) => a + b) / n

    const numerator = indices.reduce(
      (sum, x, i) => sum + (x - meanX) * (recent[i] - meanY),
      0,
    )
    const denominator = indices.reduce(
      (sum, x) => sum + Math.pow(x - meanX, 2),
      0,
    )

    return denominator === 0 ? 0 : numerator / denominator
  }
}
