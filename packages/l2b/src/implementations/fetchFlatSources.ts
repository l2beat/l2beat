import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import path from 'path'
import { CliLogger, HttpClient } from '@l2beat/shared'
import { FlatSourcesApiResponse } from '@l2beat/shared-pure'
import chalk from 'chalk'

const ENDPOINT = '/api/flat-sources'

export async function fetchFlatSources(
  backendUrl: string,
): Promise<FlatSourcesApiResponse> {
  const httpClient = new HttpClient()
  const response = await httpClient.fetch(`${backendUrl}${ENDPOINT}`, {
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
    },
  })
  return FlatSourcesApiResponse.parse(await response.json())
}

export function saveIntoDirectory(
  logger: CliLogger,
  flat: FlatSourcesApiResponse,
  outputDirectory: string,
) {
  logger.logLine(
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
  logger: CliLogger,
  flat: FlatSourcesApiResponse,
  discoveryPath: string,
) {
  logger.logLine(chalk.green('Saving into discovery...'))

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
