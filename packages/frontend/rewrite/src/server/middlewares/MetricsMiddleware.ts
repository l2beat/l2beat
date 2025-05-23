import type { NextFunction, Request, Response } from 'express'

export function MetricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(`[${req.method}] ${req.originalUrl} - processing...`)

  const start = process.hrtime.bigint()

  const originalSend = res.send

  // Intercept response to measure size
  res.send = function (body) {
    const end = process.hrtime.bigint()
    const durationMs = Number(end - start) / 1_000_000 // Convert nanoseconds to milliseconds

    // Determine response size
    let size
    if (body === undefined || body === null) {
      size = 0
    } else if (Buffer.isBuffer(body)) {
      size = body.length
    } else if (typeof body === 'string') {
      size = Buffer.byteLength(body)
    } else {
      const jsonString = JSON.stringify(body)
      size = Buffer.byteLength(jsonString)
    }

    res.setHeader('metrics-execution-time', durationMs.toFixed(2))
    res.setHeader('metrics-data-size', size)
    console.log(
      `[${req.method}] ${req.originalUrl} - ${durationMs.toFixed(2)}ms - ${formatBytes(size)}`,
    )

    return originalSend.call(this, body)
  }

  next()
}

function formatBytes(bytes: number) {
  return (bytes / 1024).toFixed(2) + 'KiB'
}
