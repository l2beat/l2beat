import type { Logger } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'

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
  /**
   * Job to run. The signal aborts when the task or the run times out: the
   * pool stops waiting then, so the job must not write anything afterwards.
   */
  job: (signal: AbortSignal) => Promise<T>
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

type PoolRun<T> = {
  tasks: Task<T>[]
  results: TaskResult<T>[]
  errors: TaskError[]
  nextTaskIndex: number
  timedOut: boolean
  runningTaskControllers: Set<AbortController>
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
 *   job: (signal) => updateProject(project, signal),
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

    const run: PoolRun<T> = {
      tasks,
      results: [],
      errors: [],
      nextTaskIndex: 0,
      timedOut: false,
      runningTaskControllers: new Set(),
    }

    const runTimeout = setTimeout(() => abortRun(run), settings.timeoutPerRunMs)
    try {
      const workers = Array.from(
        { length: settings.workerCount },
        (_, workerId) => runWorker(run, workerId),
      )
      // Every running task settles once the run aborts, so this cannot hang.
      await Promise.all(workers)
    } finally {
      clearTimeout(runTimeout)
    }

    reportTasksNotStarted(run)
    assert(run.runningTaskControllers.size === 0)
    assert(run.results.length + run.errors.length === tasks.length)

    logger.info('Worker pool finished', {
      totalTasks: tasks.length,
      successfulCount: run.results.length,
      failedCount: run.errors.length,
      totalCount: tasks.length,
      timedOut: run.timedOut,
    })

    return { results: run.results, errors: run.errors, timedOut: run.timedOut }
  }

  function abortRun<T>(run: PoolRun<T>): void {
    run.timedOut = true
    logger.warn('Run timeout occurred', {
      timeoutMs: settings.timeoutPerRunMs,
      successfulCount: run.results.length,
      failedCount: run.errors.length,
      totalCount: run.tasks.length,
    })
    for (const controller of run.runningTaskControllers) {
      controller.abort(
        new Error('Run timeout', {
          cause: { timeoutMs: settings.timeoutPerRunMs },
        }),
      )
    }
  }

  async function runWorker<T>(run: PoolRun<T>, workerId: number) {
    logger.debug('Worker started', { workerId })

    while (run.nextTaskIndex < run.tasks.length && !run.timedOut) {
      const taskIndex = run.nextTaskIndex
      run.nextTaskIndex++
      const task = run.tasks[taskIndex]
      const startTime = Date.now()
      const taskLog = {
        workerId,
        taskIndex,
        taskId: task.identity.id,
        taskName: task.identity.name,
      }

      logger.info('Task started', {
        ...taskLog,
        totalTasks: run.tasks.length,
      })

      try {
        const result = await runTask(run, task)
        run.results.push({ identity: task.identity, result })

        logger.info('Task completed', {
          ...taskLog,
          durationMs: Date.now() - startTime,
          successfulCount: run.results.length,
          failedCount: run.errors.length,
          totalCount: run.tasks.length,
        })
      } catch (error) {
        const taskError =
          error instanceof Error ? error : new Error(String(error))
        run.errors.push({ identity: task.identity, error: taskError })

        logger.error('Task failed', {
          ...taskLog,
          durationMs: Date.now() - startTime,
          error: taskError.message,
          errorCount: run.errors.length,
          totalTasks: run.tasks.length,
        })
      }
    }

    logger.debug('Worker finished', { workerId })
  }

  async function runTask<T>(run: PoolRun<T>, task: Task<T>): Promise<T> {
    const controller = new AbortController()
    const { signal } = controller
    let rejectOnAbort = () => {}
    const abortPromise = new Promise<never>((_, reject) => {
      rejectOnAbort = () => reject(signal.reason)
    })
    signal.addEventListener('abort', rejectOnAbort)

    const taskTimeout = setTimeout(() => {
      controller.abort(
        new Error('Task timeout', {
          cause: {
            taskId: task.identity.id,
            timeoutMs: settings.timeoutPerTaskMs,
          },
        }),
      )
    }, settings.timeoutPerTaskMs)
    run.runningTaskControllers.add(controller)

    try {
      return await Promise.race([task.job(signal), abortPromise])
    } finally {
      run.runningTaskControllers.delete(controller)
      clearTimeout(taskTimeout)
      signal.removeEventListener('abort', rejectOnAbort)
    }
  }

  return { runInPool }
}

function reportTasksNotStarted<T>(run: PoolRun<T>): void {
  for (
    let taskIndex = run.nextTaskIndex;
    taskIndex < run.tasks.length;
    taskIndex++
  ) {
    const task = run.tasks[taskIndex]
    run.errors.push({
      identity: task.identity,
      error: new Error('Task not started', {
        cause: { taskId: task.identity.id, runTimedOut: run.timedOut },
      }),
    })
  }
  run.nextTaskIndex = run.tasks.length
}
