import type { Env } from '@l2beat/backend-tools'
import { createRemoteJWKSet } from 'jose'
import type { BackofficeAuthConfig, BackofficeFeatureConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export function getBackofficeConfig(
  env: Env,
  flags: FeatureFlags,
  isLocal?: boolean,
): BackofficeFeatureConfig | false {
  if (!flags.isEnabled('backoffice')) {
    return false
  }

  return {
    auth: isLocal ? false : getBackofficeAuthConfig(env),
  }
}

function getBackofficeAuthConfig(env: Env): BackofficeAuthConfig {
  const teamDomain = env.string('BACKOFFICE_CF_TEAM_DOMAIN')
  const aud = env.string(['BACKOFFICE_CF_ACCESS_AUD', 'CF_ACCESS_AUD'])

  return {
    zeroTrust: {
      JWKS: createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`)),
      aud,
      teamDomain,
    },
    authToken: env.optionalString('BACKOFFICE_AUTH_TOKEN'),
  }
}
