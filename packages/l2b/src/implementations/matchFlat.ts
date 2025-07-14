import type { Logger } from '@l2beat/backend-tools'
import {
  buildSimilarityHashmap,
  estimateSimilarity,
  format,
  type HashedFileContent,
} from '@l2beat/discovery'
import { formatAsAsciiTable } from '@l2beat/shared-pure'
import { readFileSync } from 'fs'
import path from 'path'
import { listFilesRecursively } from './compare-flat-sources/common'
import { colorMap } from './compare-flat-sources/output'

interface ComparisonResult {
  leftPath: string
  rightPath: string
  similarity: number
}

export function readAndHashFile(filePath: string): HashedFileContent {
  const content = format(readFileSync(filePath, 'utf-8'))
  const hashChunks = buildSimilarityHashmap(content)

  return {
    path: filePath,
    hashChunks,
    content,
  }
}

export async function matchFile(
  baseFile: HashedFileContent,
  directoryPath: string,
  minSimilarity: number,
  maxResults: number,
  logger: Logger,
): Promise<void> {
  const filePaths = await listFilesRecursively(directoryPath)
  const solidityFiles = filePaths.filter((f) => f.endsWith('.sol'))
  const databaseFiles = solidityFiles.map((f) => readAndHashFile(f))

  const comparisons = databaseFiles
    .map((dbFile) => compareTwoFiles(baseFile, dbFile))
    .sort((a, b) => b.similarity - a.similarity)
    .filter((c) => c.similarity >= minSimilarity)
    .slice(0, maxResults)

  present(logger, directoryPath, comparisons)
}

function compareTwoFiles(
  leftFile: HashedFileContent,
  rightFile: HashedFileContent,
): ComparisonResult {
  return {
    leftPath: leftFile.path,
    rightPath: rightFile.path,
    similarity: estimateSimilarity(leftFile, rightFile),
  }
}

function subtractPath(basePath: string, fullPath: string): string {
  if (fullPath.startsWith(basePath)) {
    return fullPath.slice(basePath.length).replace(/^\//, '')
  }
  return fullPath
}

function present(
  logger: Logger,
  baseDatabasePath: string,
  result: ComparisonResult[],
) {
  const absoluteDatabasePath = path.normalize(
    path.join(process.cwd(), baseDatabasePath),
  )
  const headers = ['Path', 'Similarity']
  const rows: string[][] = []

  for (const entry of result) {
    rows.push([
      subtractPath(absoluteDatabasePath, entry.rightPath),
      colorMap(entry.similarity),
    ])
  }

  const table = formatAsAsciiTable(headers, rows)
  logger.info(table)
}
