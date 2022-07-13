import { exitWithUsage } from './usage'

export function getEnv(key: string) {
  const value = process.env[key]
  if (!value) {
    exitWithUsage(`Env variable ${key} is not present!`)
  }
  return value
}
