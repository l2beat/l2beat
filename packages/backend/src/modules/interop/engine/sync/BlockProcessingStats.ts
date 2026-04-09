export class BlockProcessingStats {
  private totalMs = 0
  private cpuMs = 0
  private count = 0

  record(durationMs: number, cpuMs: number) {
    this.totalMs += durationMs
    this.cpuMs += cpuMs
    this.count++
  }

  get() {
    return {
      totalMs: Math.round(this.totalMs),
      cpuMs: Math.round(this.cpuMs),
      count: this.count,
      avgMs: this.count > 0 ? Math.round(this.totalMs / this.count) : 0,
      avgCpuMs: this.count > 0 ? Math.round(this.cpuMs / this.count) : 0,
    }
  }
}
