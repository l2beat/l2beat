/**
 * Runs a jq filter with a hard timeout.
 *
 * A recipe is code that we execute on data we did not write, so a filter that
 * loops forever or blows up on unexpected input must fail the step, not hang
 * the run. jq-wasm is synchronous, so the only way to enforce a deadline is to
 * execute it in a `worker_threads` Worker that the main thread terminates when
 * the deadline passes. The worker is reused between calls (compiling the wasm
 * once) and replaced after a termination.
 *
 * Calls are serialised: a worker runs one filter at a time, so if two filters
 * were in flight a timeout on the first would kill the second too. The queue
 * makes a timeout hit exactly the filter that caused it.
 */
import path from 'path'
import { Worker } from 'worker_threads'
import type { JqRequest, JqResponse } from './protocol'

export interface RunJqOptions {
  timeoutMs: number
}

export class JqTimeoutError extends Error {
  constructor(readonly timeoutMs: number) {
    super(`jq filter did not finish within ${timeoutMs}ms and was terminated`)
    this.name = 'JqTimeoutError'
  }
}

export class JqFilterError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'JqFilterError'
  }
}

interface InFlight {
  request: JqRequest
  timeoutMs: number
  resolve: (value: unknown) => void
  reject: (error: Error) => void
}

export class JqRunner {
  private worker: Worker | undefined
  private nextId = 1
  private queue: InFlight[] = []
  private current: InFlight | undefined

  run(filter: string, input: unknown, options: RunJqOptions): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!(options.timeoutMs > 0)) {
        throw new Error(`timeoutMs must be positive, got ${options.timeoutMs}`)
      }
      this.queue.push({
        request: { id: this.nextId++, filter, inputJson: serialise(input) },
        timeoutMs: options.timeoutMs,
        resolve,
        reject,
      })
      this.pump()
    })
  }

  /** Releases the worker so a process that is otherwise done can exit promptly. */
  async close(): Promise<void> {
    const worker = this.worker
    this.worker = undefined
    await worker?.terminate()
  }

  private pump(): void {
    if (this.current !== undefined) {
      return
    }
    const next = this.queue.shift()
    if (next === undefined) {
      this.worker?.unref()
      return
    }
    this.current = next
    this.dispatch(next)
  }

  private dispatch(job: InFlight): void {
    const worker = this.getWorker()
    // Keep the process alive while a result is pending; the worker is
    // unref'd again when the queue drains so an idle runner never blocks exit.
    worker.ref()

    const timer = setTimeout(() => {
      this.replaceWorker()
      finish(() => job.reject(new JqTimeoutError(job.timeoutMs)))
    }, job.timeoutMs)

    const onMessage = (response: JqResponse) => {
      if (response.id !== job.request.id) {
        return
      }
      finish(() => settle(job, response))
    }
    const onFailure = (error: Error) => {
      this.replaceWorker()
      finish(() => job.reject(new Error(`jq worker failed: ${error.message}`)))
    }
    const onExit = (code: number) => {
      this.replaceWorker()
      finish(() =>
        job.reject(new Error(`jq worker exited with code ${code} mid-filter`)),
      )
    }

    const finish = (settleJob: () => void) => {
      clearTimeout(timer)
      worker.off('message', onMessage)
      worker.off('error', onFailure)
      worker.off('exit', onExit)
      this.current = undefined
      settleJob()
      this.pump()
    }

    worker.on('message', onMessage)
    worker.on('error', onFailure)
    worker.on('exit', onExit)
    worker.postMessage(job.request)
  }

  private getWorker(): Worker {
    if (this.worker === undefined) {
      this.worker = new Worker(workerPath())
    }
    return this.worker
  }

  private replaceWorker(): void {
    const worker = this.worker
    this.worker = undefined
    // Fire and forget: the next job starts a fresh worker regardless of how
    // long the old thread takes to die.
    void worker?.terminate()
  }
}

function settle(job: InFlight, response: JqResponse): void {
  if (!response.ok) {
    job.reject(new JqFilterError(response.message))
    return
  }
  if (response.exitCode !== 0) {
    job.reject(new JqFilterError(describeFailure(response.stderr)))
    return
  }
  const outputs = response.stdout.split('\n').filter((line) => line !== '')
  if (outputs.length !== 1) {
    job.reject(
      new JqFilterError(
        `jq filter must produce exactly one value, got ${outputs.length}`,
      ),
    )
    return
  }
  job.resolve(JSON.parse(outputs[0] as string))
}

/**
 * jq parses the text itself, so an input that JSON cannot express (undefined,
 * bigint) fails here with a clear message instead of as a jq parse error.
 */
function serialise(input: unknown): string {
  const json = JSON.stringify(input)
  if (json === undefined) {
    throw new Error('jq input must be JSON-serialisable, got undefined')
  }
  return json
}

function describeFailure(stderr: string): string {
  const message = stderr.trim()
  return message === '' ? 'jq filter failed' : message
}

/**
 * The worker is plain JavaScript (see its header), so it is `jqWorker.js`
 * both next to this file's `.ts` source under tsx and in `dist` after `tsc`.
 */
function workerPath(): string {
  return path.join(__dirname, 'jqWorker.js')
}

const defaultRunner = new JqRunner()

export function runJq(
  filter: string,
  input: unknown,
  options: RunJqOptions,
): Promise<unknown> {
  return defaultRunner.run(filter, input, options)
}
