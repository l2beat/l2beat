import { LogLevel } from '../services/Logger'

export interface Config {
  name: string
  port: number
  logLevel: LogLevel
}
