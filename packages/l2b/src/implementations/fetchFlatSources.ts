import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import path from 'path'
import { Logger } from '@l2beat/backend-tools'
import { HttpClient, formatSI } from '@l2beat/shared'
import { FlatSourcesApiResponse, formatSeconds } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { ProgressEvent, ResponseProgress } from './common/ResponseProgress'
import { colorMap } from './compare-flat-sources/output'

const ENDPOINT = '/api/flat-sources'

export async function fetchFlatSources(
  logger: Logger,
  backendUrl: string,
): Promise<FlatSourcesApiResponse> {
  const httpClient = new HttpClient()
  const response = await httpClient.fetch(`${backendUrl}${ENDPOINT}`, {
    compress: true,
  })

  const progress = new ResponseProgress(response)
  let lastPrintTime = Date.now()
  progress.on('progress', (p) => {
    const currentTime = Date.now()
    if (currentTime - lastPrintTime <= 10) {
      return
    }
    lastPrintTime = currentTime
    printProgress(logger, p)
  })
  progress.on('finish', (p) => printProgress(logger, p))

  return FlatSourcesApiResponse.parse(await response.json())
}

function printProgress(logger: Logger, progress: ProgressEvent) {
  const done = formatSI(progress.done, 'B')
  const rate = formatSI(progress.rate, 'B/s')

  if (progress.total === 0) {
    logger.info(`Downloaded ${done} [${rate}]`)
    return
  }

  const prog = colorMap(progress.progress * 100, 100)
  const total = formatSI(progress.total, 'B')
  const eta = formatSeconds(progress.eta)
  logger.info(`Downloaded ${prog} % (${done} of ${total}) [${rate} in ~${eta}]`)
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
      project.projectName,
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
      project.projectName,
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
