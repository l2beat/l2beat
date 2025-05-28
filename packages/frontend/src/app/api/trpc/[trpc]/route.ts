import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import type { NextRequest } from 'next/server'

import { appRouter } from 'rewrite/src/server/api/root'
import { createTRPCContext } from 'rewrite/src/server/api/trpc'
import { env } from '~/env'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling an HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  })
}

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
            )
          }
        : undefined,
  })

export { handler as GET, handler as POST }
