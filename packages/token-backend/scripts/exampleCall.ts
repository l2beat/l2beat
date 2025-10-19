import { config as dotenv } from 'dotenv'
import { getTokenDbClient } from '../src/client'

dotenv()

async function main() {
  const client = getTokenDbClient()
  const result = await client.tokens.getAllAbstractTokens.query()
  console.log(JSON.stringify(result, null, 2))
}

main()
