export interface Job<T> {
  task: T
  attempts: number
  executeAt: number
}

export type ShouldRetry<T> = (job: { task: T; attempts: number }) => {
  retry: boolean
  executeAfter?: number
}

export interface TaskQueueOpts<T> {
  workers?: number
  shouldRetry?: ShouldRetry<T>
  trackEvents?: boolean
}
