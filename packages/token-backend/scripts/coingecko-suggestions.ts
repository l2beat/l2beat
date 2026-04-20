import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { command, flag, run } from 'cmd-ts'
import { config as dotenv } from 'dotenv'
import { CoingeckoClient } from '../src/chains/clients/coingecko/CoingeckoClient'
import { getConfig } from '../src/config'
import { getTokenDb } from '../src/database/db'
import {
  getCoingeckoSuggestions,
  toCoingeckoSuggestionsQueueCsv,
} from '../src/trpc/routers/deployedTokens/getCoingeckoSuggestions'

function resolveOutputPath() {
  return resolve(__dirname, 'coingecko-suggestions.json')
}

function resolveQueueOutputPath() {
  return resolve(__dirname, 'coingecko-suggestions-queue.csv')
}

const cmd = command({
  name: 'coingecko-suggestions',
  args: {
    interopOnly: flag({
      long: 'interop-only',
      description: 'Only include suggestions for chains from INTEROP_CHAINS',
    }),
  },
  handler: async (args) => {
    dotenv()

    const config = getConfig()
    const tokenDb = getTokenDb(config)
    const coingeckoClient = new CoingeckoClient({
      apiKey: config.coingeckoApiKey,
    })

    try {
      const report = await getCoingeckoSuggestions(coingeckoClient, tokenDb, {
        interopOnly: args.interopOnly,
      })
      const json = JSON.stringify(report, null, 2)
      const queueCsv = toCoingeckoSuggestionsQueueCsv(report.results)
      const outputPath = resolveOutputPath()
      const queueOutputPath = resolveQueueOutputPath()
      await mkdir(dirname(outputPath), { recursive: true })
      await Promise.all([
        writeFile(outputPath, `${json}\n`, 'utf8'),
        writeFile(
          queueOutputPath,
          queueCsv.length > 0 ? `${queueCsv}\n` : '',
          'utf8',
        ),
      ])
      console.error('Report saved in coingecko-suggestions.json')
      console.error(
        'To add suggestions, open https://tokens.l2beat.com/tokens/new?tab=deployed and paste coingecko-suggestions-queue.csv into Queue -> Import.',
      )
    } finally {
      await tokenDb.close()
    }
  },
})

run(cmd, process.argv.slice(2)).catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
