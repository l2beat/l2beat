import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  COINGECKO_KEY: z.string().optional(),
  PRISMA_QUERY_LOG: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === '1'),
  AXELAR_CONFIG_URL: z
    .string()
    .url()
    .default(
      'https://axelar-mainnet.s3.us-east-2.amazonaws.com/mainnet-asset-config.json',
    ),
  ORBIT_LIST_URL: z
    .string()
    .url()
    .default('https://bridge.orbitchain.io/open/v1/api/tokenList3'),
  WORMHOLE_LIST_URL: z
    .string()
    .url()
    .default(
      'https://raw.githubusercontent.com/wormhole-foundation/wormhole-token-list/main/content/by_source.csv',
    ),
  QUEUE_DASHBOARD_PORT: port().optional(),
})

function port() {
  return z.string().transform((v) => {
    const vInt = parseInt(v)
    if (vInt < 0 || vInt > 65535) {
      throw new Error('Invalid port number')
    }
    return vInt
  })
}

export const env = (() => {
  const result = schema.safeParse(process.env)
  if (!result.success) {
    // TODO: better env parsing errors
    console.error(result.error.errors)
    process.exit(1)
  }
  return result.data
})()
