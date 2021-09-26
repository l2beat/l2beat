import { LogLevel } from '../services/Logger'
import { Config } from './Config'

export function getTestConfig(): Config {
  return {
    name: 'Backend/Test',
    logger: {
      logLevel: LogLevel.NONE,
      format: 'plain',
    },
    port: 1337,
    ethereumJsonRpcUrl: 'https://example.com',
  }
}
