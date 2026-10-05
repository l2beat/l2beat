import { formatSI, HttpClient } from '@l2beat/shared'
import {
  assert,
  FLAT_SOURCES_ZSTD_WINDOW_LOG,
  FlatSourcesApiEntry,
  FlatSourcesApiHeader,
  formatSeconds,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { cpSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'fs'
import path from 'path'
import { pipeline, Readable } from 'stream'
import type { ReadableStream } from 'stream/web'
import { constants, createZstdDecompress } from 'zlib'
import type { CliLogger } from './common/CliLogger'
import {
  type ProgressEvent,
  trackDownloadProgress,
} from './common/trackDownloadProgress'

const ENDPOINT = '/api/flat-sources'
const NEWLINE = 0x0a
const STAGING_DIRECTORY = '.flat@download'

export async function syncFlatSources(
  cli: CliLogger,
  backendUrl: string,
  discoveryPath: string,
  outputDirectory: string | undefined,
): Promise<void> {
  const { projectCount, projects } = await fetchFlatSources(cli, backendUrl)
  const { projectIds, fileCount } = await stageFlatSources(
    cli,
    projects,
    projectCount,
    discoveryPath,
  )
  for (const projectId of projectIds) {
    const stagingPath = path.join(discoveryPath, projectId, STAGING_DIRECTORY)
    if (outputDirectory !== undefined) {
      cpSync(stagingPath, path.join(outputDirectory, projectId), {
        recursive: true,
      })
    }
    const flatPath = path.join(discoveryPath, projectId, '.flat')
    rmSync(flatPath, { recursive: true, force: true })
    renameSync(stagingPath, flatPath)
  }
  const targets = [outputDirectory, discoveryPath]
    .filter((target) => target !== undefined)
    .map((target) => chalk.magenta(target))
    .join(' and ')
  cli.log(
    `Saved ${projectIds.length} projects (${fileCount} files) into ${targets}`,
  )
}

async function stageFlatSources(
  cli: CliLogger,
  projects: AsyncGenerator<FlatSourcesApiEntry>,
  projectCount: number,
  discoveryPath: string,
): Promise<{ projectIds: string[]; fileCount: number }> {
  const staging = cli.status()
  const projectIds: string[] = []
  let fileCount = 0
  try {
    for await (const project of projects) {
      staging.update(
        `Staging ${projectIds.length + 1}/${projectCount} ${project.projectId}`,
      )
      const stagingPath = path.join(
        discoveryPath,
        project.projectId,
        STAGING_DIRECTORY,
      )
      rmSync(stagingPath, { recursive: true, force: true })
      projectIds.push(project.projectId)
      fileCount += writeFlatFiles(stagingPath, project.flat)
    }
  } catch (error) {
    for (const projectId of projectIds) {
      rmSync(path.join(discoveryPath, projectId, STAGING_DIRECTORY), {
        recursive: true,
        force: true,
      })
    }
    throw error
  }
  assert(projectIds.length === projectCount)
  staging.done(`Staged ${projectIds.length} projects`)
  return { projectIds, fileCount }
}

async function fetchFlatSources(
  cli: CliLogger,
  backendUrl: string,
): Promise<{
  projectCount: number
  projects: AsyncGenerator<FlatSourcesApiEntry>
}> {
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
  if (!response.ok) {
    throw new Error(
      `Fetching flat sources failed: HTTP ${response.status} ${response.statusText}`,
    )
  }
  assert(response.body !== null)
  const lines = readLines(response.body as ReadableStream<Uint8Array>)
  const first = await lines.next()
  if (first.done) {
    throw new Error('Flat sources response is empty')
  }
  const { projectCount } = FlatSourcesApiHeader.parse(JSON.parse(first.value))
  const projects = readProjects(lines, projectCount, () => {
    assert(last !== undefined)
    download.done(
      `Downloaded ${formatSI(last.done, 'B')} in ${formatSeconds(last.elapsed)}`,
    )
  })
  return { projectCount, projects }
}

function readLines(body: ReadableStream<Uint8Array>): AsyncIterator<string> {
  const decompressed = pipeline(
    Readable.fromWeb(body),
    createZstdDecompress({
      params: { [constants.ZSTD_d_windowLogMax]: FLAT_SOURCES_ZSTD_WINDOW_LOG },
    }),
    () => {},
  )
  return splitLines(decompressed)
}

export async function* splitLines(
  chunks: AsyncIterable<Buffer>,
): AsyncGenerator<string> {
  let partial: Buffer[] = []
  for await (const chunk of chunks) {
    let lineStart = 0
    let newline = chunk.indexOf(NEWLINE, lineStart)
    while (newline !== -1) {
      partial.push(chunk.subarray(lineStart, newline))
      yield Buffer.concat(partial).toString('utf8')
      partial = []
      lineStart = newline + 1
      newline = chunk.indexOf(NEWLINE, lineStart)
    }
    if (lineStart < chunk.length) {
      partial.push(chunk.subarray(lineStart))
    }
  }
  if (partial.length > 0) {
    throw new Error('Flat sources response ends mid line')
  }
}

async function* readProjects(
  lines: AsyncIterator<string>,
  projectCount: number,
  onDone: () => void,
): AsyncGenerator<FlatSourcesApiEntry> {
  for (let index = 0; index < projectCount; index++) {
    const line = await lines.next()
    if (line.done) {
      throw new Error(
        `Flat sources response ended after ${index} of ${projectCount} projects`,
      )
    }
    yield FlatSourcesApiEntry.parse(JSON.parse(line.value))
  }
  const end = await lines.next()
  if (!end.done) {
    throw new Error(
      `Flat sources response has more than ${projectCount} projects`,
    )
  }
  onDone()
}

function formatDownloadProgress(progress: ProgressEvent): string {
  const done = formatSI(progress.done, 'B')
  const rate = chalk.magenta(formatSI(progress.rate, 'B/s'))
  const elapsed = formatSeconds(progress.elapsed)
  return `Downloaded ${done} (${rate}, ${elapsed})`
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
