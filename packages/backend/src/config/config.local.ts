import { config as dotenv } from 'dotenv'

import { LogLevel } from '../services/Logger'
import { Config } from './Config'
import { getEnv } from './getEnv'

export function getLocalConfig(): Config {
  dotenv()
  return {
    name: 'Backend/Local',
    logLevel: getEnv.integer('LOG_LEVEL', LogLevel.INFO),
    port: getEnv.integer('PORT', 3000),
  }
}
