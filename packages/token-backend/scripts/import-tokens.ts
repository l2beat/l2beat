import { v } from '@l2beat/validate'
import { config as dotenv } from 'dotenv'
import { getTokenDbClient } from '../src/client'

dotenv()

const AbstractToken = v.object({
  id: v.string(),
  issuer: v.string().optional(),
  category: v.string().optional(),
  symbol: v.string(),
  iconUrl: v.string().optional(),
  coingeckoId: v.string().optional(),
  coingeckoListingTimestamp: v.number().optional(),
  reviewed: v.boolean().optional(),
  deployedTokens: v
    .array(
      v.object({
        chain: v.string(),
        address: v.string(),
      }),
    )
    .optional(),
})

const DeployedToken = v.object({
  chain: v.string(),
  address: v.string(),
  decimals: v.number(),
  symbol: v.string(),
  deploymentTimestamp: v.number(),
  comment: v.string().optional(),
})

const TokenConnection = v.object({
  from: v.object({
    chain: v.string(),
    address: v.string(),
  }),
  to: v.object({
    chain: v.string(),
    address: v.string(),
  }),
  type: v.string(),
  params: v.string().optional(),
  comment: v.string().optional(),
})

type TokenImportFile = v.infer<typeof TokenImportFile>
const TokenImportFile = v.array(
  v.object({
    abstract: v.array(AbstractToken),
    deployed: v.array(DeployedToken),
    connections: v.array(TokenConnection),
  }),
)

type CallFn = <T>(
  address: string,
  abi: string, // | utils.FunctionFragment,
  args: unknown[],
) => Promise<T | undefined>

type CallFnProvider = (chain: string) => CallFn

function main() {
  const apiUrl = process.env['TOKEN_BACKEND_TRPC_URL']
  const authToken = process.env['TOKEN_BACKEND_CF_TOKEN']
  if (!apiUrl || !authToken) {
    console.log('Please set TOKEN_BACKEND_TRPC_URL and TOKEN_BACKEND_CF_TOKEN')
    return
  }
  const client = getTokenDbClient({
    apiUrl,
    authToken,
    callSource: 'test-script',
  })
}

main()
