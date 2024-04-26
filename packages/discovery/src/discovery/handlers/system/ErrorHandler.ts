import { getErrorMessage } from '../../../utils/getErrorMessage'
import { ClassicHandler, HandlerResult } from '../Handler'

export class ErrorHandler implements ClassicHandler {
  readonly dependencies = []
  private readonly errorMessage: string

  constructor(
    readonly field: string,
    error: unknown,
  ) {
    this.errorMessage = getErrorMessage(error)
  }

  async execute(): Promise<HandlerResult> {
    return Promise.resolve({ field: this.field, error: this.errorMessage })
  }
}
