import type { Logger } from '@l2beat/backend-tools'
import { formatSI, HttpClient } from '@l2beat/shared'
import { FlatSourcesApiResponse, formatSeconds } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import path from 'path'
import { type ProgressEvent, ResponseProgress } from './common/ResponseProgress'
import { colorMap } from './compare-flat-sources/output'

const ENDPOINT = '/api/flat-sources'

export async function fetchFlatSources(
  logger: Logger,
  backendUrl: string,
): Promise<FlatSourcesApiResponse> {
  const httpClient = new HttpClient()
  const response = await httpClient.fetchRaw(`${backendUrl}${ENDPOINT}`, {
    compress: true,
    timeout: 0,
  })

  const progress = new ResponseProgress(response)
  progress.on('progress', (p) => printProgress(logger, p))
  progress.on('finish', (p) => {
    printProgress(logger, p)
    finishProgress(logger, p)
  })

  return FlatSourcesApiResponse.parse(await response.json())
}

function printProgress(logger: Logger, progress: ProgressEvent) {
  const done = formatSI(progress.done, 'B')
  const rate = chalk.magenta(formatSI(progress.rate, 'B/s'))

  if (progress.total === 0) {
    logger.info('lineDownloaded', `Downloaded ${done} [${rate}]`)
    return
  }

  const prog = colorMap(progress.progress * 100, 100)
  const total = formatSI(progress.total, 'B')
  const eta = formatSeconds(progress.eta)
  logger.info(
    'lineDownloaded',
    `Downloaded ${prog} % (${done} of ${total}) [${rate} in ~${eta}]`,
  )
}

function finishProgress(logger: Logger, progress: ProgressEvent) {
  printProgress(logger, progress)
}

export function saveIntoDirectory(
  logger: Logger,
  flat: FlatSourcesApiResponse,
  outputDirectory: string,
) {
  logger.info(
    [chalk.green('Saving into directory'), chalk.magenta(outputDirectory)].join(
      ' ',
    ),
  )

  for (const project of flat) {
    const outputPath = path.join(
      outputDirectory,
      project.projectId,
      project.chainName,
    )
    mkdirSync(outputPath, { recursive: true })

    for (const filePath of Object.keys(project.flat)) {
      const dir = path.dirname(filePath)
      const fileOutputDirectory = path.join(outputPath, dir)
      if (fileOutputDirectory !== outputPath) {
        mkdirSync(fileOutputDirectory, { recursive: true })
      }

      const fileOutputPath = path.join(outputPath, filePath)
      writeFileSync(fileOutputPath, project.flat[filePath])
    }
  }
}

export function saveIntoDiscovery(
  logger: Logger,
  flat: FlatSourcesApiResponse,
  discoveryPath: string,
) {
  logger.info(chalk.green('Saving into discovery...'))

  for (const project of flat) {
    const outputPath = path.join(
      discoveryPath,
      project.projectId,
      project.chainName,
      '.flat',
    )
    if (existsSync(outputPath)) {
      rmSync(outputPath, { recursive: true })
    }
    mkdirSync(outputPath, { recursive: true })

    for (const filePath in project.flat) {
      const dir = path.dirname(filePath)
      const fileOutputDirectory = path.join(outputPath, dir)
      if (fileOutputDirectory !== outputPath) {
        mkdirSync(fileOutputDirectory, { recursive: true })
      }

      const fileOutputPath = path.join(outputPath, filePath)
      writeFileSync(fileOutputPath, project.flat[filePath])
    }
  }
}
