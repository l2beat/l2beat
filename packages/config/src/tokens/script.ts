import { getEnv } from '@l2beat/backend-tools'
import { CoingeckoClient, EtherscanClient, HttpClient } from '@l2beat/shared'
import {
  ChainId,
  EthereumAddress,
  stringAs,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { providers } from 'ethers'
import { readFileSync } from 'fs'
import { parse, ParseError } from 'jsonc-parser'
import { z } from 'zod'

import { getTokenInfo } from '../../scripts/tokens/add/getTokenInfo'

const FILE_PATH = './src/tokens/source.jsonc'

const SourceEntry = z.object({
  symbol: z.string(),
  address: stringAs(EthereumAddress),
  category: z.union([
    z.literal('ether'),
    z.literal('stablecoin'),
    z.literal('other'),
  ]),
})

const Source = z.record(z.array(SourceEntry))

async function main() {
  const content = readFileSync(FILE_PATH, 'utf-8')

  const errors: ParseError[] = []
  const parsed = parse(content, errors, {
    allowTrailingComma: true,
  }) as Record<string, string>
  if (errors.length !== 0) {
    throw new Error('Cannot parse manuallyVerified.jsonc')
  }

  const result = Source.parse(parsed)
  const env = getEnv()
  const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')

  const http = new HttpClient()
  const coingeckoClient = new CoingeckoClient(http, coingeckoApiKey)

  for (const [chainId, entries] of Object.entries(result)) {
    console.log(chainId)

    // TODO: this should be automatically loaded using new dynamic envs
    const alchemyApiKey = env.string('CONFIG_ALCHEMY_API_KEY')
    const etherscanApiKey = env.string('ETHERSCAN_API_KEY')
    const provider = new providers.AlchemyProvider('homestead', alchemyApiKey)
    const etherscanClient = new EtherscanClient(
      http,
      etherscanApiKey,
      new UnixTime(0), // TODO: this should come from chain config
    )

    for (const entry of entries) {
      const token: Token = await getTokenInfo(
        provider,
        etherscanClient,
        coingeckoClient,
        entry.address,
        ChainId.ETHEREUM,
        'CBV',
        'locked',
        entry.category,
      )
      console.log(token)
    }
  }
}

main().catch((e: unknown) => {
  console.error(e)
})
