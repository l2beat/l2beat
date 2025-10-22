import { config as dotenv } from 'dotenv'
import { getTokenDbClient } from '../src/client'

dotenv()

async function main() {
  const client = getTokenDbClient({
    apiUrl: process.env['TOKEN_BACKEND_TRPC_URL'] ?? 'unknown',
    authToken: process.env['TOKEN_BACKEND_CF_TOKEN'],
  })
  const result = await client.tokens.getAllAbstractTokens.query()
  console.log(JSON.stringify(result, null, 2))
}

main()
