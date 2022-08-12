import { exitWithUsage } from './usage'

export function getEnv(key: string, fallback?: string) {
  const value = process.env[key]
  if (!value) {
    if (fallback) {
      return fallback
    }
    exitWithUsage(`Env variable ${key} is not present!`)
  }
  return value
}
