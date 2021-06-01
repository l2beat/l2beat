import { config } from 'dotenv'

export interface Config {
  rpcUrl: string
}

export function getConfig(): Config {
  config()
  getEnv('GOOGLE_APPLICATION_CREDENTIALS')
  return {
    rpcUrl: getEnv('RPC_URL'),
  }
}

function getEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment variable ${name} missing!`)
  }
  return value
}
