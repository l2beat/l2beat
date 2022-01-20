import { json } from '@l2beat/common'

interface StatusReporter {
  getStatus(): json
}

export class StatusService {
  constructor(private reporters: Record<string, StatusReporter>) {}

  getStatus() {
    const result: Record<string, json> = {}
    for (const name of Object.keys(this.reporters)) {
      result[name] = this.reporters[name].getStatus()
    }
    return result
  }

  getReporters() {
    return Object.keys(this.reporters)
  }

  getReporterStatus(name: string) {
    if (!this.reporters[name]) {
      throw new Error(`Unknown reporter ${name}!`)
    }
    return this.reporters[name].getStatus()
  }
}
