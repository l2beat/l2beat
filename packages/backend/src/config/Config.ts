import { LogLevel } from '../services/Logger'

export interface Config {
  name: string
  logLevel: LogLevel
  port: number
}
