import { getEnv } from '@l2beat/backend-tools'
import { CoingeckoClient, EtherscanClient, HttpClient } from '@l2beat/shared'
import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  numberAs,
  stringAs,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { providers } from 'ethers'
import { readFileSync, writeFileSync } from 'fs'
import { parse, ParseError } from 'jsonc-parser'
import { z } from 'zod'

import { getTokenInfo } from './getTokenInfo'

const SOURCE_FILE_PATH = './src/tokens/source.jsonc'
const OUTPUT_FILE_PATH = './src/tokens/tokenList.json'

const SourceEntry = z.object({
  symbol: z.string(),
  address: stringAs(EthereumAddress),
  category: z.union([
    z.literal('ether'),
    z.literal('stablecoin'),
    z.literal('other'),
  ]),
})

const OutputEntry = z.object({
  /** Internal token id. Usually ticker-name */
  id: stringAs((s) => AssetId(s)),
  /** Token name as dictated by the token contract */
  name: z.string(),
  /** Token Coingecko API id. Used to fetch prices */
  coingeckoId: stringAs((s) => CoingeckoId(s)),
  /** Token address. Only Ether has no address */
  address: stringAs((s) => EthereumAddress(s)).optional(),
  /** Token symbol as dictated by the token contract */
  symbol: z.string(),
  /** Token decimals as dictated by the token contract */
  decimals: z.number(),
  /** Timestamp of the token contract deployment transaction */
  sinceTimestamp: numberAs((n) => new UnixTime(n)),
  /** Which category does the token belong to */
  category: z.union([
    z.literal('ether'),
    z.literal('stablecoin'),
    z.literal('other'),
  ]),
  /** URL to icon for this token, provided by Coingecko */
  iconUrl: z.optional(z.string()),
  chainId: numberAs(ChainId).default(1), // TODO: get rid of default
  type: z
    .union([z.literal('CBV'), z.literal('EBV'), z.literal('NMV')])
    .default('CBV'), // TODO: get rid of default
  formula: z
    .union([
      z.literal('totalSupply'),
      z.literal('locked'),
      z.literal('circulatingSupply'),
    ])
    .default('locked'), // TODO: get rid of default
})
type OutputEntry = z.infer<typeof OutputEntry>

const Source = z.record(z.array(SourceEntry))
const Output = z.object({
  comment: z.string().optional(),
  tokens: z.array(OutputEntry),
})

async function main() {
  console.log(chalk.yellow('Loading... ') + 'source file')
  const sourceFile = readFileSync(SOURCE_FILE_PATH, 'utf-8')
  const errors: ParseError[] = []
  const parsed = parse(sourceFile, errors, {
    allowTrailingComma: true,
  }) as Record<string, string>
  if (errors.length !== 0) {
    throw new Error('Cannot parse manuallyVerified.jsonc')
  }
  const source = Source.parse(parsed)
  console.log(chalk.green('Loaded ') + 'source file\n')

  console.log(chalk.yellow('Loading... ') + 'output file')
  const outputFile = readFileSync(OUTPUT_FILE_PATH, 'utf-8')
  const output = Output.parse(JSON.parse(outputFile))
  console.log(chalk.green('Loaded ') + 'output file\n')

  const result: OutputEntry[] = []

  console.log(chalk.yellow('Loading... ') + 'environment variables')
  const env = getEnv()
  const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')
  if (coingeckoApiKey) {
    console.log(chalk.green('Detected ') + 'COINGECKO_API_KEY')
  } else {
    console.log(chalk.red('Missing ') + 'COINGECKO_API_KEY')
  }
  const http = new HttpClient()
  const coingeckoClient = new CoingeckoClient(http, coingeckoApiKey)
  console.log(chalk.green('Loaded ') + 'environment variables\n')

  for (const [chainId, entries] of Object.entries(source)) {
    // TODO: check chainId is valid
    console.log(chalk.yellow('Processing... ') + `chain ${chainId}`)

    for (const entry of entries) {
      const present = output.tokens.find(
        (e) => e.address && e.address === entry.address,
      )

      if (present) {
        console.log(
          chalk.gray('Skipping ') +
            `${chainId} ${entry.symbol} ${entry.address.toString()}`,
        )
        result.push(present)
        continue
      }

      console.log(
        chalk.yellow('Fetching... ') +
          `${chainId} ${entry.symbol} ${entry.address.toString()}`,
      )

      // TODO: this should be automatically loaded using new dynamic envs
      const alchemyApiKey = env.string('CONFIG_ALCHEMY_API_KEY')
      const etherscanApiKey = env.string('ETHERSCAN_API_KEY')
      const provider = new providers.AlchemyProvider('homestead', alchemyApiKey)
      const etherscanClient = new EtherscanClient(
        http,
        etherscanApiKey,
        new UnixTime(0), // TODO: this should come from chain config
      )

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

      console.log(
        chalk.green('Fetched ') +
          `${chainId} ${entry.symbol} ${entry.address.toString()}`,
      )

      result.push(token)
    }
    console.log(chalk.green('Processed ') + `chain ${chainId}\n`)
  }

  console.log(chalk.yellow('Sorting... ') + 'tokens by chain and address')
  result.sort((a, b) => {
    if (a.chainId !== b.chainId) {
      return Number(a.chainId) - Number(b.chainId)
    }
    if (a.address && b.address) {
      return a.address.localeCompare(b.address.toString())
    }
    return a.symbol.localeCompare(b.symbol)
  })
  console.log(chalk.green('Sorted ') + 'tokens\n')

  console.log(chalk.yellow('Saving... ') + 'output file')
  const outputJson = JSON.stringify(
    {
      comment: output.comment,
      tokens: result,
    },
    null,
    2,
  )
  writeFileSync(OUTPUT_FILE_PATH, outputJson)
  console.log(chalk.green('Saved ') + 'output file\n')
}

main().catch((e: unknown) => {
  console.error(e)
})
