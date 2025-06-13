import * as readline from 'readline'
import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import chalk from 'chalk'
import Table from 'cli-table'
import { command, positional, run, string } from 'cmd-ts'
import { RangeClient } from './RangeClient'
const Chart = require('cli-chart')

const URL = 'https://api.range.org/v1'
const API_KEY = 'api-key-placeholder' // Replace with your actual API key

const args = {
  protocol: positional({
    type: string,
    displayName: 'protocol',
    description: 'Project for which metrics will be fetched',
  }),
}

let start: UnixTime
let end: UnixTime
let http: HttpClient
let rangeClient: RangeClient
let protocol: string
let chart: { addBar: (arg0: number, arg1: string) => void; draw: () => void }
let table: Table

const cmd = command({
  name: 'execute',
  args,
  handler: async (args) => {
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)

    start = UnixTime.toStartOf(UnixTime.now(), 'day') - 1 * UnixTime.DAY
    end = start + 1 * UnixTime.HOUR

    chart = new Chart({
      xlabel: '',
      ylabel: 'volume [$]',
      direction: 'y',
      height: 20,
      lmargin: 15,
      step: 2,
      ymax: 1000,
    })

    table = new Table({
      head: ['Time', 'Transactions', 'Volume', 'Top token'],
      colWidths: [50, 20, 20, 40],
    })

    protocol = args.protocol
    http = new HttpClient()
    rangeClient = new RangeClient({
      http,
      url: URL,
      apiKey: API_KEY,
      logger: Logger.SILENT,
      retryStrategy: 'RELIABLE',
      callsPerMinute: 50,
      sourceName: 'range',
    })
    await getStats()
  },
})

run(cmd, process.argv.slice(2))

// function initLogger() {
//   const logger = new Logger({
//     logLevel: 'INFO',
//     transports: [
//       {
//         transport: console,
//         formatter: new LogFormatterPretty(),
//       },
//     ],
//   })
//   return logger
// }

async function getStats() {
  const stats = await rangeClient.getProtocolStats(protocol, start, end)

  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)

  process.stdout.write('Protocol: ' + chalk.green(protocol) + '\n\n')

  stats.denomSums.sort((a, b) => b.totalUsd - a.totalUsd)
  const topToken = stats.denomSums[0]

  chart.addBar(Math.floor(stats.totalUsd), 'green')
  chart.draw()

  table.push([
    UnixTime.toDate(start).toISOString(),
    stats.totalTransactions.toString(),
    `$${Number(stats.totalUsd.toFixed(2)).toLocaleString()}`,
    `${topToken.denom} ($${Number(topToken.totalUsd.toFixed(2)).toLocaleString()})`,
  ])
  console.log(table.toString())

  start = start + 1 * UnixTime.HOUR
  end = end + 1 * UnixTime.HOUR

  setTimeout(getStats, 1000 * 5)
}
