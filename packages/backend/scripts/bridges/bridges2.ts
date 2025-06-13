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
const COLORS = ['green', 'blue', 'yellow', 'red']

const args = {
  protocols: positional({
    type: string,
    displayName: 'protocols',
    description: 'Project for which metrics will be fetched',
  }),
}

let start: UnixTime
let end: UnixTime
let http: HttpClient
let rangeClient: RangeClient
let protocols: string[]
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
      width: 100,
      lmargin: 15,
      step: 2,
      ymax: 1000,
    })

    protocols = args.protocols.split(',')

    table = new Table({
      head: ['Time'].concat(protocols),
      colWidths: [40].concat(new Array(protocols.length).fill(20)),
    })

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

async function getStats() {
  const tableRow: string[] = [UnixTime.toDate(start).toISOString()]
  let protocolString = 'Protocols: '

  for (let index = 0; index < protocols.length; index++) {
    const stats = await rangeClient.getProtocolStats(
      protocols[index],
      start,
      end,
    )

    protocolString +=
      indexToChalk(index, protocols[index]) +
      (index < protocols.length - 1 ? ', ' : '')
    chart.addBar(Math.floor(stats.totalUsd), COLORS[index])
    tableRow.push(`$${Number(stats.totalUsd.toFixed(2)).toLocaleString()}`)
  }

  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)

  process.stdout.write(protocolString + '\n\n')

  chart.draw()
  table.push(tableRow)
  console.log(table.toString())

  chart.addBar(0, 'black')
  start = start + 1 * UnixTime.HOUR
  end = end + 1 * UnixTime.HOUR

  setTimeout(getStats, 1000 * 5)
}

function indexToChalk(index: number, text: string): string {
  if (index === 0) {
    return chalk.green(text)
  } else if (index === 1) {
    return chalk.blue(text)
  } else if (index === 2) {
    return chalk.yellow(text)
  } else if (index === 3) {
    return chalk.red(text)
  } else {
    return text
  }
}
