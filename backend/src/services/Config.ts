import { config } from 'dotenv'

export interface Config {
  rpcUrl: string
  etherscanApiKey: string
}

export function getConfig(): Config {
  config()
  return {
    rpcUrl: getEnv('RPC_URL'),
    etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
  }
}

function getEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment variable ${name} missing!`)
  }
  return value
}
