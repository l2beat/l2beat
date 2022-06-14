interface RequestEntry {
  responseTimeMs: number
  success: boolean
}

export class RequestTracker {
  private recentBuffer: (RequestEntry | null)[]
  private bufferPosition = 0

  private lifetimeRequests = 0
  private lifetimeErrors = 0
  private lifetimeResponseTimeMs = 0

  private recentRequests = 0
  private recentErrors = 0
  private recentResponseTimeMs = 0

  private lastUpdatedAt: string = new Date().toISOString()

  constructor(private recentSize: number) {
    this.recentBuffer = new Array(recentSize).fill(null)
  }

  add(responseTimeMs: number, success: boolean) {
    this.lastUpdatedAt = new Date().toISOString()

    this.lifetimeRequests += 1
    this.lifetimeErrors += success ? 0 : 1
    this.lifetimeResponseTimeMs += responseTimeMs

    const last = this.recentBuffer[this.bufferPosition]
    if (last === null) {
      this.recentRequests += 1
      this.recentErrors += success ? 0 : 1
      this.recentResponseTimeMs += responseTimeMs
    } else {
      this.recentErrors += (success ? 0 : 1) + (last.success ? 0 : -1)
      this.recentResponseTimeMs += responseTimeMs - last.responseTimeMs
    }

    this.recentBuffer[this.bufferPosition] = { responseTimeMs, success }
    this.bufferPosition = (this.bufferPosition + 1) % this.recentSize
  }

  getStats() {
    return {
      lastUpdatedAt: this.lastUpdatedAt,
      lifetimeRequests: this.lifetimeRequests,
      lifetimeErrors: this.lifetimeErrors,
      lifetimeErrorRate: toPercent(this.lifetimeErrors, this.lifetimeRequests),
      lifetimeAverageResponseTimeMs: Math.floor(
        this.lifetimeResponseTimeMs / (this.lifetimeRequests || 1),
      ),
      recentRequests: this.recentRequests,
      recentErrors: this.recentErrors,
      recentErrorRate: toPercent(this.recentErrors, this.recentRequests),
      recentAverageResponseTimeMs: Math.floor(
        this.recentResponseTimeMs / (this.recentRequests || 1),
      ),
    }
  }
}

function toPercent(numerator: number, denominator: number) {
  if (denominator === 0) {
    return '0.00%'
  }
  return ((numerator / denominator) * 100).toFixed(2) + '%'
}
