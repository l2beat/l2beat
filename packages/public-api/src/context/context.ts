import { AsyncLocalStorage } from 'node:async_hooks'

export type RequestContext = { user?: string }

export const requestContext = new AsyncLocalStorage<RequestContext>()

export function getContext(): RequestContext {
  const ctx = requestContext.getStore()
  if (!ctx) return { user: undefined }
  return ctx
}
