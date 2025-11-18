import type { Logger } from '@l2beat/backend-tools'

export type WorkerPoolSettings = {
  /** Number of concurrent workers */
  workerCount: number
  /** Timeout per individual task in milliseconds */
  timeoutPerTaskMs: number
  /** Total timeout for all tasks in milliseconds */
  timeoutPerRunMs: number
  /** Logger to use for logging */
  logger: Logger
}

export type TaskIdentity = {
  /** Id of the task */
  id: string
  /** Name of the task */
  name: string
}

export type Task<T> = {
  /** Identifier of the task */
  identity: TaskIdentity
  /** Job to run */
  job: () => Promise<T>
}

export type WorkerPoolResult<T> = {
  /** Array of results, undefined if task failed or timed out */
  results: TaskResult<T>[]
  /** Array of errors, undefined if task succeeded */
  errors: TaskError[]
  /** Whether the entire run timed out */
  timedOut: boolean
}

export type WorkerPool = {
  runInPool: <T>(tasks: Task<T>[]) => Promise<WorkerPoolResult<T>>
}

export type TaskError = {
  identity: TaskIdentity
  error: Error
}

export type TaskResult<T> = {
  identity: TaskIdentity
  result: T
}

/**
 * Creates a worker pool that executes tasks concurrently.
 *
 * @example
 * ```typescript
 * const workerPool = createWorkerPool({
 *   workerCount: 3,
 *   timeoutPerTaskMs: 30000, // 30 seconds per task
 *   timeoutPerRunMs: 300000, // 5 minutes for all tasks
 *   logger: Logger.INFO,
 * })
 *
 * const tasks = projects.map(project => ({
 *   name: project,
 *   job: () => updateProject(project),
 * }))
 * const { results, errors, timedOut } = await workerPool.runInPool(tasks)
 * ```
 */
export function createWorkerPool(settings: WorkerPoolSettings): WorkerPool {
  const logger = settings.logger.for('WorkerPool')

  async function runInPool<T>(tasks: Task<T>[]): Promise<WorkerPoolResult<T>> {
    logger.info('Starting worker pool', {
      workers: settings.workerCount,
      tasks: tasks.length,
      timeoutPerTaskMs: settings.timeoutPerTaskMs,
      timeoutPerRunMs: settings.timeoutPerRunMs,
    })

    const successfulResults: TaskResult<T>[] = []
    const errors: TaskError[] = []

    let timedOut = false
    let runTimeoutOccurred = false

    const runTimeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        runTimeoutOccurred = true
        logger.warn('Run timeout occurred', {
          timeoutMs: settings.timeoutPerRunMs,
          successfulCount: successfulResults.length,
          failedCount: errors.length,
          totalCount: tasks.length,
        })
        resolve()
      }, settings.timeoutPerRunMs)
    })

    let nextTaskIndex = 0

    const worker = async (workerId: number) => {
      logger.debug('Worker started', { workerId })

      while (nextTaskIndex < tasks.length && !runTimeoutOccurred) {
        const taskIndex = nextTaskIndex
        nextTaskIndex++
        const task = tasks[taskIndex]
        const startTime = Date.now()

        logger.info('Task started', {
          workerId,
          taskIndex,
          taskId: task.identity.id,
          taskName: task.identity.name,
          totalTasks: tasks.length,
        })

        const taskTimeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Task timeout'))
          }, settings.timeoutPerTaskMs)
        })

        try {
          const result = await Promise.race([task.job(), taskTimeoutPromise])
          const duration = Date.now() - startTime
          successfulResults.push({
            identity: task.identity,
            result: result,
          })

          logger.info('Task completed', {
            workerId,
            taskIndex,
            taskId: task.identity.id,
            taskName: task.identity.name,
            durationMs: duration,
            successfulCount: successfulResults.length,
            failedCount: errors.length,
            totalCount: tasks.length,
          })
        } catch (error) {
          const duration = Date.now() - startTime
          const err = error instanceof Error ? error : new Error(String(error))
          errors.push({
            identity: task.identity,
            error: err,
          })

          logger.error('Task failed', {
            workerId,
            taskIndex,
            taskId: task.identity.id,
            taskName: task.identity.name,
            durationMs: duration,
            error: err.message,
            errorCount: errors.length,
            totalTasks: tasks.length,
          })
        }
      }

      logger.debug('Worker finished', { workerId })
    }

    const workers = Array.from({ length: settings.workerCount }, (_, i) =>
      worker(i),
    )

    await Promise.race([Promise.all(workers), runTimeoutPromise])

    timedOut = runTimeoutOccurred

    logger.info('Worker pool finished', {
      totalTasks: tasks.length,
      successfulCount: successfulResults.length,
      failedCount: errors.length,
      totalCount: tasks.length,
      timedOut,
    })

    return { results: successfulResults, errors, timedOut }
  }

  return { runInPool }
}
