export class BlockProcessingStats {
  private totalMs = 0
  private count = 0

  record(durationMs: number) {
    this.totalMs += durationMs
    this.count++
  }

  get() {
    return {
      totalMs: Math.round(this.totalMs),
      count: this.count,
      avgMs: this.count > 0 ? Math.round(this.totalMs / this.count) : 0,
    }
  }
}
