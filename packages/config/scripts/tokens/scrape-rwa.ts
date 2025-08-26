import { Logger } from '@l2beat/backend-tools'
import { HttpClient, RetryHandler } from '@l2beat/shared'
import type { EthereumAddress, LegacyToken } from '@l2beat/shared-pure'
import * as cheerio from 'cheerio'
import { writeFileSync } from 'fs'
import groupBy from 'lodash/groupBy'
import { ProjectService } from '../../src'

const SOURCE_FILE_PATH = './src/tokens/rwa.json'
const DB_PATH = './build/db.sqlite'

main().catch((e: unknown) => {
  console.error(e)
})

type RwaTokenInfo = {
  id: string
  symbol: string
  address: EthereumAddress | undefined
  categories: string[]
  isStablecoin: boolean
  isOnRWA: boolean
}

async function main() {
  const ps = new ProjectService(DB_PATH)
  const tokens = await ps.getTokens()
  let counter = 0

  const bySymbol = groupBy(tokens, 'symbol')
  const entries = Object.entries(bySymbol)

  const output: RwaTokenInfo[] = []

  const tasks = entries.map(async ([symbol, tokensInGroup]) => {
    const html = await fetchRwaPage(`assets/${remapSymbol(symbol)}`)
    counter += tokensInGroup.length

    console.log(
      `${counter}/${tokens.length} (${tokensInGroup.length}) - ${symbol}`,
    )

    if (!html) {
      for (const token of tokensInGroup) {
        output.push({
          id: token.id,
          symbol: token.symbol,
          address: token.address,
          categories: [],
          isStablecoin: false,
          isOnRWA: false,
        } satisfies RwaTokenInfo)
      }
      return
    }

    if (isMainPage(html)) {
      for (const token of tokensInGroup) {
        output.push({
          id: token.id,
          symbol: token.symbol,
          address: token.address,
          categories: [],
          isStablecoin: false,
          isOnRWA: false,
        } satisfies RwaTokenInfo)
      }
      return
    }

    for (const token of tokensInGroup) {
      const info = parseAssetPageHtml(token, html)
      output.push(info)
    }
  })

  await Promise.all(tasks)

  writeFileSync(SOURCE_FILE_PATH, JSON.stringify(output, null, 2))
}

async function fetchRwaPage(path: string) {
  const logger = Logger.INFO.for('RWA').configure({
    logLevel: 'NONE',
  })

  const strategy = new RetryHandler({
    maxRetries: 10,
    initialRetryDelayMs: 1000,
    maxRetryDelayMs: 10_000,
    logger,
  })
  const client = new HttpClient()

  const result = await strategy.retry(async () => {
    const res = await client.fetchRaw(`https://app.rwa.xyz/${path}`, {
      timeout: 100_000,
    })

    if (!res.ok) {
      throw new Error(`Error fetching RWA page for ${path}: ${res.status}`)
    }

    return res
  })

  return result.text()
}

function isMainPage(html: string) {
  const $ = cheerio.load(html)

  const title = $('title').text()

  return title === 'RWA.xyz | Analytics on Tokenized Real-World Assets'
}

// async function scrapeStableCoins() {
//   const tickers: string[] = []

//   const html = await fetchRwaPage('stablecoins')

//   if (!html) {
//     return tickers
//   }

//   const $ = cheerio.load(html)
//   const tables = $('table')
//   const stablecoinTable = tables[2]
//   const rows = $(stablecoinTable).find('tr')

//   for (const row of rows) {
//     const ticker = $(row).find('td').eq(1).text()
//     tickers.push(ticker)
//   }

//   return tickers
// }

function parseAssetPageHtml(token: LegacyToken, html: string): RwaTokenInfo {
  const $ = cheerio.load(html)

  const categoriesDiv = $(
    '#__next > div.flex.flex-1.flex-col.md\\:pl-\\[250px\\] > main > div > div > div.flex.flex-col.gap-4.mb-4 > div > div.flex.flex-col > div.flex.flex-wrap.items-center.gap-3',
  )

  const categories = categoriesDiv
    .children('span')
    .map((_, el) => $(el).text())
    .get()

  return {
    id: token.id,
    symbol: token.symbol,
    address: token.address,
    categories,
    isStablecoin: categories.includes('Stablecoins'),
    isOnRWA: true,
  }
}

const remaps: Record<string, string> = {
  'USDC.e': 'USDC',
}

function remapSymbol(symbol: string): string {
  return symbol in remaps ? remaps[symbol] : symbol
}
