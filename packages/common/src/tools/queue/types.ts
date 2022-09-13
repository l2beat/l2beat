export interface Job<T> {
  task: T
  attempts: number
  executeAfter?: number
}

export type ShouldRetry<T> = (job: {
  task: T
  attempts: number
}) => boolean | number
