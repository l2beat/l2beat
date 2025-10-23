export type WorkerPoolSettings = {
  /** Number of concurrent workers */
  count: number
  /** Timeout per individual task in milliseconds */
  timeoutPerTaskMs: number
  /** Total timeout for all tasks in milliseconds */
  timeoutPerRunMs: number
}

export type Task<T> = () => Promise<T>

export type WorkerPoolResult<T> = {
  /** Array of results, undefined if task failed or timed out */
  results: (T | undefined)[]
  /** Array of errors, undefined if task succeeded */
  errors: (Error | undefined)[]
  /** Whether the entire run timed out */
  timedOut: boolean
}

export type WorkerPool = {
  runInPool: <T>(tasks: Task<T>[]) => Promise<WorkerPoolResult<T>>
}

/**
 * Creates a worker pool that executes tasks concurrently with limited parallelism.
 *
 * @example
 * ```typescript
 * const workerPool = createWorkerPool({
 *   count: 3,
 *   timeoutPerTask: 30000, // 30 seconds per task
 *   timeoutPerRun: 300000, // 5 minutes for all tasks
 * })
 *
 * const tasks = projects.map(project => () => updateProject(project))
 * const { results, errors, timedOut } = await workerPool.runInPool(tasks)
 * ```
 */
export function createWorkerPool(settings: WorkerPoolSettings): WorkerPool {
  async function runInPool<T>(tasks: Task<T>[]): Promise<WorkerPoolResult<T>> {
    const results: (T | undefined)[] = new Array(tasks.length).fill(undefined)
    const errors: (Error | undefined)[] = new Array(tasks.length).fill(
      undefined,
    )
    let timedOut = false
    let runTimeoutOccurred = false

    const runTimeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        runTimeoutOccurred = true
        resolve()
      }, settings.timeoutPerRunMs)
    })

    let nextTaskIndex = 0

    const worker = async () => {
      while (nextTaskIndex < tasks.length && !runTimeoutOccurred) {
        const taskIndex = nextTaskIndex++
        const task = tasks[taskIndex]

        const taskTimeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Task timeout'))
          }, settings.timeoutPerTaskMs)
        })

        try {
          const result = await Promise.race([task(), taskTimeoutPromise])
          results[taskIndex] = result
        } catch (error) {
          errors[taskIndex] =
            error instanceof Error ? error : new Error(String(error))
        }
      }
    }

    const workers = Array.from({ length: settings.count }, () => worker())

    await Promise.race([Promise.all(workers), runTimeoutPromise])

    timedOut = runTimeoutOccurred

    return { results, errors, timedOut }
  }

  return { runInPool }
}
