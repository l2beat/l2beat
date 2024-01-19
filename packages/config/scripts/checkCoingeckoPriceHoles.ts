import { getEnv } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoinMarketChartRangeData,
  HttpClient,
} from '@l2beat/shared'
import { CoingeckoId, Token, UnixTime } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { readFileSync } from 'fs'
import { z } from 'zod'

const Output = z.object({
  comment: z.string().optional(),
  tokens: z.array(Token),
})
const OUTPUT_FILE_PATH = './src/tokens/tokenList.json'
const SECONDS_IN_DAY = 24 * 60 * 60
const param = process.argv[2]
const HOW_MANY_DAYS_IS_HOLE = param ? +param : 4

async function main() {
  const http = new HttpClient()
  const coingeckoApiKey = getEnv().optionalString('COINGECKO_API_KEY')
  const coingeckoClient = new CoingeckoClient(http, coingeckoApiKey)
  console.log(chalk.yellow('Loading... ') + 'output file')
  const outputFile = readFileSync(OUTPUT_FILE_PATH, 'utf-8')
  const output = Output.parse(JSON.parse(outputFile))
  console.log(chalk.green('Loaded ') + 'output file\n')

  for (const token of output.tokens) {
    const coingeckoPriceHistoryData =
      await coingeckoClient.getCoinMarketChartRange(
        token.coingeckoId,
        'usd',
        UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')),
        UnixTime.now(),
      )

    findHoles(coingeckoPriceHistoryData, token.coingeckoId)
  }
}

main().catch((e: unknown) => {
  console.error(e)
})

function findHoles(
  coingeckoPriceHistoryData: CoinMarketChartRangeData,
  token: CoingeckoId,
) {
  const prices = coingeckoPriceHistoryData.prices

  for (let i = 0; i < prices.length; i++) {
    if (i === prices.length - 1) break

    const t1 = Math.floor(prices[i].date.getTime() / 1000)
    const t2 = Math.floor(prices[i + 1].date.getTime() / 1000)

    const daysBetween = Math.floor((t2 - t1) / SECONDS_IN_DAY)

    if (daysBetween >= HOW_MANY_DAYS_IS_HOLE) {
      console.log(
        `${daysBetween} days\t${new UnixTime(t1).toYYYYMMDD()} - ${new UnixTime(
          t2,
        ).toYYYYMMDD()}\t${token.toString()}\t`,
      )
    }
  }
}

/* Run on 19.01.2024
4 days	2021-04-05 - 2021-04-09	alchemix-usd	
4 days	2021-04-18 - 2021-04-22	alchemix-usd	
4 days	2023-07-12 - 2023-07-16	degate	
4 days	2023-09-06 - 2023-09-10	degate	
4 days	2023-09-14 - 2023-09-18	degate	
4 days	2023-06-16 - 2023-06-20	feg-token	
23 days	2023-08-11 - 2023-09-03	feg-token	
11 days	2020-10-16 - 2020-10-27	huobi-btc	
5 days	2020-10-31 - 2020-11-05	huobi-btc	
26 days	2021-04-23 - 2021-05-19	kyber-network-crystal	
5 days	2023-08-18 - 2023-08-23	nucypher	
6 days	2023-08-24 - 2023-08-30	nucypher	
4 days	2023-09-03 - 2023-09-07	nucypher	
5 days	2021-01-01 - 2021-01-06	origin-dollar	
4 days	2020-11-23 - 2020-11-27	shiba-inu	
5 days	2020-12-21 - 2020-12-26	shiba-inu	
5 days	2023-04-07 - 2023-04-12	staked-frax-ether	
8 days	2023-04-13 - 2023-04-21	staked-frax-ether	
15 days	2023-04-23 - 2023-05-08	staked-frax-ether	
4 days	2020-10-09 - 2020-10-13	beefy-finance	
9 days	2020-12-05 - 2020-12-14	beefy-finance	
*/
