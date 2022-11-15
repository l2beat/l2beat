import { HealthStatus } from '../../config/Config'

export class HealthController {
  constructor(private readonly health?: HealthStatus) {}

  getStatus() {
    return {
      releasedAt: this.health?.releasedAt,
      startedAt: this.health?.startedAt,
      commitSha: this.health?.commitSha,
    }
  }
}
