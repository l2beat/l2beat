import { DiscoveryLogger, getErrorMessage } from '@l2beat/common'

import { Handler, HandlerResult } from '../Handler'

export class ErrorHandler implements Handler {
  readonly dependencies = []
  private readonly errorMessage: string

  constructor(
    readonly field: string,
    error: unknown,
    readonly discoveryLogger: DiscoveryLogger,
  ) {
    this.errorMessage = getErrorMessage(error)
  }

  async execute(): Promise<HandlerResult> {
    return Promise.resolve({ field: this.field, error: this.errorMessage })
  }
}
