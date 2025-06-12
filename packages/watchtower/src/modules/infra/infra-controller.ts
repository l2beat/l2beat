import type { Logger } from '@l2beat/backend-tools'

type InfrastructureControllerDependencies = {
  logger: Logger
}

export class InfrastructureController {
  constructor(
    private readonly dependencies: InfrastructureControllerDependencies,
  ) {}

  handleFrontendPreview() {
    return 'OK'
  }
}
