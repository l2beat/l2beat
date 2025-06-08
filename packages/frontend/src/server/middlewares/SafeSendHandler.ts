import type { NextFunction, Request, Response } from 'express'

export function SafeSendHandler(_: Request, res: Response, next: NextFunction) {
  const originalSend = res.send.bind(res)
  // @ts-expect-error - we want to override the send method
  res.send = function (body) {
    if (res.headersSent) {
      return
    }
    return originalSend(body)
  }
  next()
}
