import { config as dotenv } from 'dotenv'
import { getTokenDbClient } from '../src/client'

dotenv()

async function main() {
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
  const result = await client.tokens.getAllAbstractTokens.query()
  console.log(JSON.stringify(result, null, 2))
}

main()
