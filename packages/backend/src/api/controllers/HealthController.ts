import { HealthStatus } from '../../config/Config'

export class HealthController {
  constructor(private readonly health?: HealthStatus) {}

  getStatus() {
    return {
      startedAt: this.health?.startedAt,
      commitSha: this.health?.commitSha,
    }
  }
}
