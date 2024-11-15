import { createSafeActionClient } from 'next-safe-action'
import { getSession } from '~/server/auth/cookie'

export const actionClient = createSafeActionClient({}).use(async ({ next }) => {
  const session = await getSession()
  if (!session) {
    throw new Error('Session is not valid!')
  }
  return next({ ctx: { session } })
})
