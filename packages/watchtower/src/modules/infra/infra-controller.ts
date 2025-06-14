import type { Logger } from '@l2beat/backend-tools'
import type { PreviewManager } from '../preview-manager'

type InfrastructureControllerDependencies = {
  logger: Logger
  previewManager: PreviewManager
}

export class InfrastructureController {
  constructor(
    private readonly dependencies: InfrastructureControllerDependencies,
  ) {}

  async handleFrontendPreview(id: number) {
    await this.dependencies.previewManager.start(id)
  }

  statusRaw(id: number) {
    return this.dependencies.previewManager.findById(id)
  }
}
