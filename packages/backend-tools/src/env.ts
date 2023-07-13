import { config as dotenv } from 'dotenv'

export function getEnv(): Env {
  dotenv()
  return new Env({ ...process.env })
}

export class Env {
  constructor(private readonly env: Record<string, string | undefined>) {}

  string(key: string, fallback?: string): string {
    const value = this.env[key]
    if (value !== undefined) {
      return value
    }
    if (fallback !== undefined) {
      return fallback
    }
    throw new Error(`Missing environment variable ${key}!`)
  }

  optionalString(key: string): string | undefined {
    return this.env[key]
  }

  integer(key: string, fallback?: number): number {
    const value = this.optionalInteger(key)
    if (value !== undefined) {
      return value
    }
    if (fallback !== undefined) {
      return fallback
    }
    throw new Error(`Missing environment variable ${key}!`)
  }

  optionalInteger(key: string): number | undefined {
    const value = this.env[key]
    if (value !== undefined) {
      const result = parseInt(value)
      if (result.toString() === value) {
        return result
      }
      throw new Error(`Environment variable ${key} is not an integer!`)
    }
  }

  boolean(key: string, fallback?: boolean): boolean {
    const value = this.optionalBoolean(key)
    if (value !== undefined) {
      return value
    }
    if (fallback !== undefined) {
      return fallback
    }
    throw new Error(`Missing environment variable ${key}!`)
  }

  optionalBoolean(key: string): boolean | undefined {
    const value = this.env[key]
    if (value !== undefined) {
      const lowerCased = value.toLowerCase()

      const trueValues = ['true', 'yes', '1']
      const falseValues = ['false', 'no', '0']

      if (trueValues.includes(lowerCased)) return true
      if (falseValues.includes(lowerCased)) return false

      throw new Error(`Environment variable ${key} is not a boolean value!`)
    }
  }
}
