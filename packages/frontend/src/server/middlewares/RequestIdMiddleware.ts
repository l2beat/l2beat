import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

const REQUEST_ID_HEADER = 'x-request-id'

export function RequestIdMiddleware() {
  return (req: Request, _: Response, next: NextFunction) => {
    const id = resolveIncomingRequestId(req) ?? randomUUID()
    req.headers[REQUEST_ID_HEADER] = id
    next()
  }
}

export function getRequestId(req: Request): string {
  const header = req.header(REQUEST_ID_HEADER)
  return header ? header.trim() : 'unknown'
}

function resolveIncomingRequestId(req: Request): string | undefined {
  const header = req.header(REQUEST_ID_HEADER) ?? req.header('x-correlation-id')
  return header ? header.trim() : undefined
}
