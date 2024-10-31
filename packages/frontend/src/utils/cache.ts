import { unstable_cache } from 'next/cache'
import { env } from '~/env'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cache<T extends (...args: any[]) => Promise<any>>(
  ...args: Parameters<typeof unstable_cache<T>>
) {
  if (!env.CACHE) {
    return args[0]
  }
  return unstable_cache(...args)
}
