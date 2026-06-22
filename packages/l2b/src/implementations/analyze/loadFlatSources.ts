import type { ConfigReader } from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { statSync } from 'fs'
import { readFile } from 'fs/promises'
import path from 'path'
import { listFilesRecursively } from '../compare-flat-sources/common'
import { getCodePaths } from '../discovery/getCodePaths'

export class AnalyzeSourceError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

export interface AnalyzerContractSourceInput {
  project: string
  address: ChainSpecificAddress
  entrypoint: string
}

export interface FlatEntrypointSource {
  flatDir: string
  entrypoint: string
}

export async function loadAnalyzerSourceInput(
  configReader: ConfigReader,
  input: AnalyzerContractSourceInput,
): Promise<{ files: Record<string, Uint8Array>; entrypoint: string }> {
  let sourcePaths: ReturnType<typeof getCodePaths>['codePaths']
  try {
    sourcePaths = getCodePaths(
      configReader,
      input.project,
      input.address,
    ).codePaths
  } catch {
    throw new AnalyzeSourceError(500, 'Failed to load source files')
  }

  const selectedSource = sourcePaths.find(
    ({ name }) => name === input.entrypoint,
  )
  if (selectedSource === undefined) {
    throw new AnalyzeSourceError(404, 'Entrypoint not found')
  }

  return await loadFlatEntrypointSourceInput(selectedSource.path)
}

export async function loadFlatEntrypointSourceInput(
  entrypointPath: string,
): Promise<{
  files: Record<string, Uint8Array>
  entrypoint: string
}> {
  const { flatDir, entrypoint } = resolveFlatEntrypointSource(entrypointPath)

  try {
    return {
      entrypoint,
      files: await readSourceFiles(flatDir),
    }
  } catch {
    throw new AnalyzeSourceError(500, 'Failed to load source files')
  }
}

export function resolveFlatEntrypointSource(
  entrypointPath: string,
): FlatEntrypointSource {
  const absoluteEntrypointPath = path.resolve(entrypointPath)

  let isFile: boolean
  try {
    isFile = pathIsFile(absoluteEntrypointPath)
  } catch {
    throw new AnalyzeSourceError(400, 'Entrypoint path does not exist')
  }

  if (!isFile) {
    throw new AnalyzeSourceError(400, 'Entrypoint path is not a file')
  }

  const flatDir = getFlatSourceRoot(absoluteEntrypointPath)
  const entrypoint = normalizeArchivePath(
    path.relative(flatDir, absoluteEntrypointPath),
  )

  return {
    flatDir,
    entrypoint,
  }
}

function pathIsFile(filePath: string) {
  return statSync(filePath).isFile()
}

function getFlatSourceRoot(entrypointPath: string): string {
  const segments = entrypointPath.split(path.sep)
  const flatIndex = segments.lastIndexOf('.flat')

  if (flatIndex === -1) {
    throw new AnalyzeSourceError(
      400,
      'Entrypoint path must be inside a .flat directory',
    )
  }

  return segments.slice(0, flatIndex + 1).join(path.sep)
}

async function readSourceFiles(
  sourceRoot: string,
): Promise<Record<string, Uint8Array>> {
  const filePaths = (await listFilesRecursively(sourceRoot)).sort()
  const files = await Promise.all(
    filePaths.map(async (filePath) => [
      normalizeArchivePath(path.relative(sourceRoot, filePath)),
      await readFile(filePath),
    ]),
  )

  return Object.fromEntries(files)
}

function normalizeArchivePath(filePath: string) {
  return filePath.split(path.sep).join('/')
}
