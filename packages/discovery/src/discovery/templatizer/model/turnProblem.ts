/**
 * Why a CLI turn failed, sorted the way the loop needs it (see
 * `isRetryable`): an unusable answer is asked again, a model that is not
 * answering stops the run.
 */
export interface TurnProblem {
  message: string
  retryable: boolean
}

export function unusableAnswer(message: string): TurnProblem {
  return { message, retryable: true }
}

export function notAnswering(message: string): TurnProblem {
  return { message, retryable: false }
}
