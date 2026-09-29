import { formatSI, HttpClient } from '@l2beat/shared'
import {
  assert,
  FlatSourcesApiResponse,
  formatSeconds,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import path from 'path'
import type { CliLogger } from './common/CliLogger'
import {
  type ProgressEvent,
  trackDownloadProgress,
} from './common/trackDownloadProgress'

const ENDPOINT = '/api/flat-sources'

export async function fetchFlatSources(
  cli: CliLogger,
  backendUrl: string,
): Promise<FlatSourcesApiResponse> {
  const httpClient = new HttpClient()
  const download = cli.status()
  let last: ProgressEvent | undefined
  const response = trackDownloadProgress(
    await httpClient.fetchRaw(`${backendUrl}${ENDPOINT}`, { timeout: 0 }),
    (progress) => {
      last = progress
      download.update(formatDownloadProgress(progress))
    },
  )
  const flat = FlatSourcesApiResponse.parse(await response.json())
  assert(last !== undefined)
  download.done(
    `Downloaded ${formatSI(last.done, 'B')} in ${formatSeconds(last.elapsed)}`,
  )
  return flat
}

function formatDownloadProgress(progress: ProgressEvent): string {
  const done = formatSI(progress.done, 'B')
  const rate = chalk.magenta(formatSI(progress.rate, 'B/s'))
  const elapsed = formatSeconds(progress.elapsed)
  return `Downloaded ${done} (${rate}, ${elapsed})`
}

export function saveIntoDirectory(
  cli: CliLogger,
  flat: FlatSourcesApiResponse,
  outputDirectory: string,
) {
  const saving = cli.status()
  let filesTotal = 0
  for (let i = 0; i < flat.length; i++) {
    const project = flat[i]
    saving.update(`Saving ${i + 1}/${flat.length} ${project.projectId}`)
    const outputPath = path.join(outputDirectory, project.projectId)
    filesTotal += writeFlatFiles(outputPath, project.flat)
  }
  saving.done(
    `Saved ${flat.length} projects (${filesTotal} files) into ${chalk.magenta(outputDirectory)}`,
  )
}

export function saveIntoDiscovery(
  cli: CliLogger,
  flat: FlatSourcesApiResponse,
  discoveryPath: string,
) {
  const saving = cli.status()
  let filesTotal = 0
  for (let i = 0; i < flat.length; i++) {
    const project = flat[i]
    saving.update(`Saving ${i + 1}/${flat.length} ${project.projectId}`)
    const outputPath = path.join(discoveryPath, project.projectId, '.flat')
    if (existsSync(outputPath)) {
      rmSync(outputPath, { recursive: true })
    }
    filesTotal += writeFlatFiles(outputPath, project.flat)
  }
  saving.done(
    `Saved ${flat.length} projects (${filesTotal} files) into ${chalk.magenta(discoveryPath)}`,
  )
}

function writeFlatFiles(
  outputPath: string,
  files: Record<string, string>,
): number {
  mkdirSync(outputPath, { recursive: true })
  let count = 0
  for (const filePath in files) {
    const fileOutputDirectory = path.join(outputPath, path.dirname(filePath))
    if (fileOutputDirectory !== outputPath) {
      mkdirSync(fileOutputDirectory, { recursive: true })
    }
    writeFileSync(path.join(outputPath, filePath), files[filePath])
    count += 1
  }
  return count
}
