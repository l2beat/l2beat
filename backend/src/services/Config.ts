import { config } from 'dotenv'

export interface Config {
  mock: boolean
  updatePrecomputed: boolean
  rpcUrl: string
  etherscanApiKey: string
}

export function getConfig(): Config {
  config()

  if (process.env.MOCK_DATA === 'true') {
    return {
      mock: true,
      updatePrecomputed: false,
      rpcUrl: 'https://mock.url',
      etherscanApiKey: 'm0ckk3y',
    }
  }

  return {
    mock: false,
    updatePrecomputed: process.env.UPDATE_PRECOMPUTED === 'true',
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
