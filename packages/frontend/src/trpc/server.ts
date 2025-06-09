import { createServerSideHelpers } from '@trpc/react-query/server'
import { appRouter } from '~/server/trpc/root'
import { createQueryClient } from './queryClient'

export type SsrHelpers = ReturnType<typeof getSsrHelpers>
export const getSsrHelpers = () =>
  createServerSideHelpers({
    router: appRouter,
    queryClient: createQueryClient(),
    ctx: { headers: new Headers() },
    // Do not serialize data to JSON, because it will be serialized again by the render function
    //     .replace(
    //       `<!--ssr-data-->`,
    //       `window.__SSR_DATA__=${JSON.stringify(data.ssr)}`,
    //     )
    transformer: {
      serialize: (data) => data,
      deserialize: (data) => data,
    },
  })
