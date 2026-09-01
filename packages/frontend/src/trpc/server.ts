import { dehydrate } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { appRouter } from '~/server/trpc/root'
import { createQueryClient } from './queryClient'

export type SsrHelpers = ReturnType<typeof getSsrHelpers>

export function getSsrHelpers() {
  const queryClient = createQueryClient()
  const trpc = createTRPCOptionsProxy({
    router: appRouter,
    queryClient,
    ctx: { headers: new Headers({ 'x-trpc-source': 'server' }) },
  })

  return {
    queryClient,
    trpc,
    dehydrate: () => dehydrate(queryClient),
  }
}
