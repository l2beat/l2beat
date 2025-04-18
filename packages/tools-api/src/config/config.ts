import { getEnv } from '@l2beat/backend-tools'

export interface Config {
  port: number
}

export function getConfig(): Config {
  const env = getEnv()
  return {
    port: env.integer('PORT', 3000),
  }
}
