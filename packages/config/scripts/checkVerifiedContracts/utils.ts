export function getEnv(name: string, fallback?: string): string {
  const value = process.env[name]
  if (value !== undefined) {
    return value
  }
  if (fallback !== undefined) {
    return fallback
  }
  throw new Error(`Missing environment variable ${name}!`)
}

export function withoutDuplicates<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}
