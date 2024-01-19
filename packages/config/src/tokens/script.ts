import { getEnv } from '@l2beat/backend-tools'
import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import {
  assert,
  AssetId,
  ChainId,
  EthereumAddress,
  stringAs,
  Token,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { providers } from 'ethers'
import { readFileSync, writeFileSync } from 'fs'
import { parse, ParseError } from 'jsonc-parser'
import { z } from 'zod'

import { chains } from '../chains'
import { getTokenInfo } from './getTokenInfo'

const SOURCE_FILE_PATH = './src/tokens/source.jsonc'
const OUTPUT_FILE_PATH = './src/tokens/tokenList.json'

const SourceEntry = z.object({
  symbol: z.string(),
  address: stringAs(EthereumAddress).optional(),
  category: z
    .union([z.literal('ether'), z.literal('stablecoin'), z.literal('other')])
    .optional(),
  type: z
    .union([z.literal('CBV'), z.literal('EBV'), z.literal('NMV')])
    .optional(),
  formula: z
    .union([
      z.literal('totalSupply'),
      z.literal('locked'),
      z.literal('circulatingSupply'),
    ])
    .optional(),

  bridgedUsing: z.optional(
    z.object({
      bridge: z.string(),
      slug: z.string().optional(),
    }),
  ),
})

const Source = z.record(z.array(SourceEntry))
const Output = z.object({
  comment: z.string().optional(),
  tokens: z.array(Token),
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

  const result: Token[] = []

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

  for (const [devId, entries] of Object.entries(source)) {
    // TODO: check chainId is valid
    console.log(chalk.yellow('Processing... ') + `chain ${devId}`)

    for (const entry of entries) {
      const type = devId === 'ethereum' ? 'CBV' : entry.type
      if (type === undefined) {
        console.log(
          chalk.red('Missing type for ') +
            `${devId} ${entry.symbol} ${entry.address?.toString() ?? ''}`,
        )
        process.exit(1)
      }
      const formula = devId === 'ethereum' ? 'locked' : entry.formula
      if (formula === undefined) {
        console.log(
          chalk.red('Missing formula for ') +
            `${devId} ${entry.symbol} ${entry.address?.toString() ?? ''}`,
        )
        process.exit(1)
      }
      const category = entry.category ?? 'other'

      const present = output.tokens.find((e) => {
        if (ChainId.fromName(devId) !== e.chainId) {
          return false
        }
        if (!e.address) {
          return e.symbol === entry.symbol
        }
        return e.address === entry.address
      })

      if (present) {
        console.log(
          chalk.gray('Skipping ') +
            `${devId} ${entry.symbol} ${entry.address?.toString() ?? ''}`,
        )
        result.push({
          ...present,
          category,
          type,
          formula,
        })
        continue
      }

      // TODO: this should be automatically loaded using new dynamic envs
      const rpcUrl = env.optionalString(`${devId.toUpperCase()}_RPC_URL`)
      if (!rpcUrl) {
        console.log(
          chalk.red('Missing environmental variable ') +
            `${devId.toUpperCase()}_RPC_URL`,
        )
        process.exit(1)
      }
      const provider = new providers.JsonRpcProvider(rpcUrl)

      const chain = chains.find((c) => c.devId === devId)

      assert(chain, `Chain ${devId} not found`)

      console.log(
        chalk.yellow('Fetching... ') +
          `${devId} ${entry.symbol} ${entry.address?.toString() ?? ''}`,
      )

      const tokenInfo = await getTokenInfo(
        provider,
        coingeckoClient,
        entry.address,
        ChainId(chain.chainId),
      )

      console.log(
        chalk.green('Fetched ') +
          `${devId} ${entry.symbol} ${entry.address?.toString() ?? ''}`,
      )

      const id = `${devId}:${tokenInfo.symbol
        .replaceAll(' ', '-')
        .toLowerCase()}-${tokenInfo.name.replaceAll(' ', '-').toLowerCase()}`

      result.push({
        id: AssetId(id),
        name: tokenInfo.name,
        coingeckoId: tokenInfo.coingeckoId,
        address: entry.address,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        sinceTimestamp: tokenInfo.sinceTimestamp,
        category,
        iconUrl: tokenInfo.iconUrl,
        chainId: ChainId(chain.chainId),
        type,
        formula,
        bridgedUsing: entry.bridgedUsing,
      })
    }
    console.log(chalk.green('Processed ') + `chain ${devId}\n`)
  }

  console.log(chalk.yellow('Sorting... ') + 'tokens by chain and name')
  result.sort((a, b) => {
    if (a.chainId !== b.chainId) {
      return Number(a.chainId) - Number(b.chainId)
    }
    return a.name.localeCompare(b.name)
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
  writeFileSync(OUTPUT_FILE_PATH, outputJson + '\n')
  console.log(chalk.green('Saved ') + 'output file\n')
}

main().catch((e: unknown) => {
  console.error(e)
})
