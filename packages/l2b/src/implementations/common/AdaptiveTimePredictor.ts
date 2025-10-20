export class AdaptiveTimePredictor {
  private durations: number[] = []
  private ewma: number | null = null
  private variance = 0
  private readonly alpha: number = 0.3
  private readonly maxHistory: number = 20

  updateAndPredict(duration: number, remainingTasks: number): number {
    this.durations.push(duration)

    if (this.durations.length > this.maxHistory) {
      this.durations.shift()
    }

    if (this.ewma === null) {
      this.ewma = duration
    } else {
      this.ewma = this.alpha * duration + (1 - this.alpha) * this.ewma
    }

    this.updateVariance()

    const isOutlier = this.isOutlier(duration)
    const trendFactor = this.calculateTrend()

    const prediction = this.getPrediction(
      remainingTasks,
      trendFactor,
      isOutlier,
    )

    return Math.max(0, prediction)
  }

  private updateVariance(): void {
    if (this.durations.length < 2) {
      this.variance = 0
      return
    }

    const mean =
      this.durations.reduce((a, b) => a + b, 0) / this.durations.length
    const squaredDiffs = this.durations.map((d) => Math.pow(d - mean, 2))
    this.variance =
      squaredDiffs.reduce((a, b) => a + b, 0) / this.durations.length
  }

  private isOutlier(duration: number): boolean {
    if (this.durations.length < 3) return false

    const mean =
      this.durations.reduce((a, b) => a + b, 0) / this.durations.length
    const stdDev = Math.sqrt(this.variance)

    return Math.abs(duration - mean) > 2 * stdDev
  }

  private calculateTrend(): number {
    if (this.durations.length < 3) return 1.0

    const n = this.durations.length
    const recentWindow = Math.min(5, n)
    const recent = this.durations.slice(-recentWindow)

    let sumX = 0
    let sumY = 0
    let sumXY = 0
    let sumXX = 0

    recent.forEach((duration, index) => {
      sumX += index
      sumY += duration
      sumXY += index * duration
      sumXX += index * index
    })

    const slope =
      (recentWindow * sumXY - sumX * sumY) /
      (recentWindow * sumXX - sumX * sumX)

    const avgDuration = sumY / recentWindow

    const trendImpact = Math.max(-0.2, Math.min(0.2, slope / avgDuration))

    return 1 + trendImpact
  }

  private getPrediction(
    remainingTasks: number,
    trendFactor: number,
    isOutlier: boolean,
  ): number {
    if (this.durations.length === 0) return 0

    let baseEstimate: number

    if (this.durations.length < 3) {
      baseEstimate =
        this.durations.reduce((a, b) => a + b, 0) / this.durations.length
    } else if (this.durations.length < 5) {
      baseEstimate = this.getMedian()
    } else {
      const trimmedMean = this.getTrimmedMean(0.1)
      // biome-ignore lint/style/noNonNullAssertion: We know it's there
      baseEstimate = this.ewma! * 0.7 + trimmedMean * 0.3
    }

    let prediction = 0
    for (let i = 0; i < remainingTasks; i++) {
      const trendDecay = Math.pow(0.95, i)
      const taskTrend = 1 + (trendFactor - 1) * trendDecay
      prediction += baseEstimate * taskTrend
    }

    const confidenceBuffer = isOutlier
      ? Math.sqrt(this.variance) * 0.5 * remainingTasks
      : 0

    return prediction + confidenceBuffer
  }

  private getMedian(): number {
    const sorted = [...this.durations].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid]
  }

  private getTrimmedMean(trimPercent: number): number {
    const sorted = [...this.durations].sort((a, b) => a - b)
    const trimCount = Math.floor(sorted.length * trimPercent)
    const trimmed = sorted.slice(trimCount, sorted.length - trimCount)
    return trimmed.reduce((a, b) => a + b, 0) / trimmed.length
  }
}
