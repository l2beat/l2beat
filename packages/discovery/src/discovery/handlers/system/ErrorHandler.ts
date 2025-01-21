import { getErrorMessage } from '../../../utils/getErrorMessage'
import type { Handler, HandlerResult } from '../Handler'

export class ErrorHandler implements Handler {
  readonly dependencies = []
  private readonly errorMessage: string

  constructor(
    readonly field: string,
    error: unknown,
  ) {
    this.errorMessage = getErrorMessage(error)
  }

  async execute(): Promise<HandlerResult> {
    return await Promise.resolve({
      field: this.field,
      error: this.errorMessage,
    })
  }
}
