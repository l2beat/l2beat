import type { Logger } from '@l2beat/backend-tools'
import {
  buildSimilarityHashmap,
  estimateSimilarity,
  format,
  type HashedFileContent,
} from '@l2beat/discovery'
import { formatAsAsciiTable } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { readFileSync } from 'fs'
import path from 'path'
import { listFilesRecursively } from './common/listFilesRecursively'

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

function colorMap(value: number, multiplier = 1): string {
  const valueString = value.toFixed(2)

  if (value < 0.125 * multiplier) {
    return chalk.grey(valueString)
  }
  if (value < 0.25 * multiplier) {
    return chalk.red(valueString)
  }
  if (value < 0.375 * multiplier) {
    return chalk.redBright(valueString)
  }
  if (value < 0.5 * multiplier) {
    return chalk.magenta(valueString)
  }
  if (value < 0.625 * multiplier) {
    return chalk.magentaBright(valueString)
  }
  if (value < 0.75 * multiplier) {
    return chalk.yellow(valueString)
  }
  if (value < 0.875 * multiplier) {
    return chalk.yellowBright(valueString)
  }
  return chalk.greenBright(valueString)
}
