import { EthereumAddress } from '@l2beat/shared'
import { config as dotenv } from 'dotenv'
import { providers } from 'ethers'
import { writeFileSync } from 'fs'

import { getEnv } from '../checkVerifiedContracts/utils'
import { getTokenInfo } from './addTokens'

async function main() {
  const provider = new providers.AlchemyProvider(
    'homestead',
    getEnv('CONFIG_ALCHEMY_API_KEY'),
  )

  const tokens = await getTokenInfo(
    provider,
    EthereumAddress('0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'),
    'other',
  )

  // writeFileSync('src/tokens/tokenList.json', JSON.stringify(tokens, null, 2))
}

dotenv()
main().catch((e) => {
  console.error(e)
})
