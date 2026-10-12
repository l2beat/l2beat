import { formatSI } from '@l2beat/shared'
import { asciiProgressBar, formatSeconds } from '@l2beat/shared-pure'
import chalk from 'chalk'
import type { FetchStats } from './fetchDiscoveryCache'

const BAR_WIDTH = 20
const PROGRESS_WIDTH = BAR_WIDTH + ' 100%'.length
const KEYS_WIDTH = 13
const COUNT_WIDTH = 8
const SIZE_WIDTH = 11
const SEPARATOR = '  '

export function formatHeader(nameWidth: number): string {
  return chalk.bold(
    [
      'kind'.padEnd(nameWidth),
      'progress'.padEnd(PROGRESS_WIDTH),
      'fetched'.padStart(KEYS_WIDTH),
      'cached'.padStart(COUNT_WIDTH),
      'transferred'.padStart(SIZE_WIDTH),
      'decoded'.padStart(SIZE_WIDTH),
      'evicted'.padStart(COUNT_WIDTH),
    ].join(SEPARATOR),
  )
}

export function formatScanningRow(
  name: string,
  nameWidth: number,
  keysFound: number,
): string {
  return [
    name.padEnd(nameWidth),
    chalk.dim(`scanning, ${keysFound} keys found`),
  ].join(SEPARATOR)
}

export function formatFetchingRow(
  name: string,
  nameWidth: number,
  stats: FetchStats,
): string {
  const keysDone = stats.keysFetched + stats.keysEvicted
  return [
    name.padEnd(nameWidth),
    formatProgress(keysDone, stats.keysMissing),
    `${keysDone}/${stats.keysMissing}`.padStart(KEYS_WIDTH),
    `${stats.keysScanned - stats.keysMissing}`.padStart(COUNT_WIDTH),
    formatSI(stats.bytesTransferred, 'B').padStart(SIZE_WIDTH),
    formatSI(stats.bytesDecoded, 'B').padStart(SIZE_WIDTH),
    `${stats.keysEvicted}`.padStart(COUNT_WIDTH),
  ].join(SEPARATOR)
}

export function formatTotalRow(
  nameWidth: number,
  stats: FetchStats,
  elapsedMs: number,
): string {
  const row = formatFetchingRow('Total', nameWidth, stats)
  return chalk.bold(`${row}  in ${formatSeconds(elapsedMs / 1000)}`)
}

function formatProgress(done: number, total: number): string {
  if (total === 0) {
    return `${chalk.cyan(asciiProgressBar(1, 1, BAR_WIDTH))} 100%`
  }
  const percent = Math.floor((done * 100) / total)
  const bar = chalk.cyan(asciiProgressBar(done, total, BAR_WIDTH))
  return `${bar} ${`${percent}%`.padStart(4)}`
}
