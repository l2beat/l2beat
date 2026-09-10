import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'

export function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8'))
}

export function writeText(path: string, content: string) {
  writeFileSync(path, content)
}

export function setOutput(name: string, value: string) {
  const file = process.env.GITHUB_OUTPUT
  if (file) appendFileSync(file, `${name}=${value}\n`)
  else console.log(`${name}=${value}`)
}

export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env ${name}`)
  return value
}
