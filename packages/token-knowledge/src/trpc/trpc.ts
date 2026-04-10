import { initTRPC } from '@trpc/server'

export const createContext = () => ({})

type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
  transformer: {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  },
})

export const router = t.router
export const publicProcedure = t.procedure
