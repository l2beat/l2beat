import type { NextFunction, Request, Response } from 'express'

export function LoadDurationLogger(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = process.hrtime()
  res.on('finish', () => {
    const diff = process.hrtime(start)
    const time = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2) // ms with 2 decimal places
    console.log(`[${req.method}] ${req.originalUrl} - ${time} ms`)
  })
  next()
}
