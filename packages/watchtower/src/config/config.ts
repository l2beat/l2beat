import type { Config } from './types'

import { getEnv } from '@l2beat/backend-tools'

export function getConfig(): Config {
  const env = getEnv()

  return {
    port: env.integer('PORT', 3000),
  }
}
