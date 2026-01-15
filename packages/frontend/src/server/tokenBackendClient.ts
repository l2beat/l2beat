import { getTokenDbClient } from '@l2beat/token-backend'
import { env } from '~/env'

export const tokenBackendClient = env.TOKEN_BACKEND_URL
  ? getTokenDbClient({
      apiUrl: env.TOKEN_BACKEND_URL,
      authToken: env.TOKEN_BACKEND_AUTH_TOKEN,
    })
  : undefined
