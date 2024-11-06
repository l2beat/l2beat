import { Google } from 'arctic'
import { env } from '~/env'
import { getBaseUrl } from '~/lib/base-url'

export const google = new Google(
  env.GOOGLE_CLIENT_ID ?? '',
  env.GOOGLE_CLIENT_SECRET ?? '',
  `${getBaseUrl()}/api/auth/callback`,
)
