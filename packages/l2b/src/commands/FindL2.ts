import { existsSync } from 'fs'
import path from 'path'
import { getDiscoveryPaths } from '@l2beat/discovery'
import { CliLogger } from '@l2beat/shared'
import { formatAsAsciiTable } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command, number, option } from 'cmd-ts'
import { BlobsFetcher } from '../implementations/find-l2/BlobsFetcher'
import { CeleniumFetcher } from '../implementations/find-l2/CeleniumFetcher'
import { RollupWtfFetcher } from '../implementations/find-l2/RollupWtfFetcher'

export const FindL2 = command({
  name: 'find-l2',
  description: 'Try to find L2s from other sources',
  args: {
    blocksToDownload: option({
      type: number,
      long: 'blocks-to-download',
      short: 'b',
      description:
        'number of blocks to check for blob transactions from the tip',
      defaultValue: () => 50000,
      defaultValueIsSerializable: true,
    }),
  },
  handler: async (args) => {
    const logger: CliLogger = new CliLogger()
    const paths = getDiscoveryPaths()

    const fetchers = [
      new CeleniumFetcher(),
      new RollupWtfFetcher(),
      new BlobsFetcher(logger, args.blocksToDownload),
    ]

    const results = await Promise.all(
      fetchers.map(async (f) => await f.fetch()),
    )

    const projects = [...new Set(results.flatMap((r) => r.names))].filter(
      (p) => !existsSync(path.join(paths.discovery, p)),
    )

    const headers = [
      'Projects',
      ...results.flatMap((r) => [
        `In ${r.sourcePretty}`,
        ...(r.columns ?? []).map((c) => c.header),
      ]),
    ]
    const rows: string[][] = []
    for (const project of projects.sort()) {
      const ins = results.flatMap((r) => {
        const index = r.names.indexOf(project)
        if (index === -1) {
          const empty = ['']
          for (const _ of r.columns ?? []) {
            empty.push('')
          }
          return empty
        }

        const entries = [chalk.greenBright('x')]
        for (const column of r.columns ?? []) {
          entries.push(column.rows[index])
        }
        return entries
      })

      rows.push([project, ...ins])
    }

    const table = formatAsAsciiTable(headers, rows)
    logger.logLine(table)
  },
})
