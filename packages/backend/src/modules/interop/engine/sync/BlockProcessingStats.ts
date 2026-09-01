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
      totalMs: this.totalMs,
      cpuMs: this.cpuMs,
      count: this.count,
      avgMs: this.count > 0 ? this.totalMs / this.count : 0,
      avgCpuMs: this.count > 0 ? this.cpuMs / this.count : 0,
    }
  }
}
