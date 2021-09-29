import { LogLevel } from '../services/Logger'

export interface Config {
  name: string
  logger: {
    logLevel: LogLevel
    format: 'pretty' | 'plain'
  }
  port: number
  alchemyApiKey: string
  etherscanApiKey: string
  databaseUrl: string
}
