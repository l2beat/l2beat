import { HealthConfig } from '../../config/Config'

export class HealthController {
  constructor(private readonly health?: HealthConfig) {}

  getStatus() {
    return {
      releasedAt: this.health?.releasedAt,
      startedAt: this.health?.startedAt,
      commitSha: this.health?.commitSha,
    }
  }
}
