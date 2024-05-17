import { AsyncLocalStorage } from 'async_hooks'
import { Config } from '../../build/config'

export interface PageBuildContext {
  config: Config
  path: string
}

const pageBuildLocalStorage = new AsyncLocalStorage<PageBuildContext>()

export function withPageBuildContext<T>(ctx: PageBuildContext, fn: () => T): T {
  return pageBuildLocalStorage.run(ctx, fn)
}

/**
 * This is technically not a hook, but it's used in a similar way.
 * @returns The current page build context.
 */
export function usePageBuildContext(): PageBuildContext {
  const ctx = pageBuildLocalStorage.getStore()
  if (!ctx) {
    throw new Error('This function must be called within a page build context.')
  }
  return ctx
}
