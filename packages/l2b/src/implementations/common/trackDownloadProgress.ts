import { pipeBody } from '@l2beat/shared'

export interface ProgressEvent {
  total: number
  done: number
  startedAt: number
  elapsed: number
  rate: number
  estimated: number
  progress: number
  eta: number
}

/**
 * Reports after every chunk and once more when the body ends. Read the body
 * from the returned response: a web stream has a single consumer.
 */
export function trackDownloadProgress(
  response: Response,
  onProgress: (progress: ProgressEvent) => void,
): Response {
  const total = Number(response.headers.get('content-length'))
  const startedAt = Date.now()
  let done = 0
  const report = () => onProgress(progressEvent(total, done, startedAt))

  return pipeBody(
    response,
    new TransformStream({
      transform: (chunk, controller) => {
        done += chunk.length
        report()
        controller.enqueue(chunk)
      },
      flush: report,
    }),
  )
}

function progressEvent(
  total: number,
  done: number,
  startedAt: number,
): ProgressEvent {
  const elapsed = (Date.now() - startedAt) / 1000
  const rate = done / elapsed
  const estimated = total / rate
  const progress = done / total
  const eta = estimated - elapsed

  return { total, done, startedAt, elapsed, rate, estimated, progress, eta }
}
