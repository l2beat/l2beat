import * as fs from 'node:fs'
import { join } from 'node:path'
import { format } from '@l2beat/discovery'
import { getPlainLogger } from './common/getPlainLogger'

export function solFmt(fileOrDir: string) {
  const logger = getPlainLogger()

  if (!fs.existsSync(fileOrDir)) {
    console.error('File or directory does not exist.')
  }

  const stat = fs.statSync(fileOrDir)
  const files: string[] = []
  if (stat.isDirectory()) {
    files.push(...recurseDirectory(fileOrDir))
  } else {
    files.push(fileOrDir)
  }

  logger.info(`There are ${files.length} files`)
  for (const file of files) {
    if (!file.endsWith('.sol')) {
      continue
    }
    const content = fs.readFileSync(file, 'utf-8')
    const formatted = format(content)
    fs.writeFileSync(file, formatted)
  }
}

function recurseDirectory(path: string): string[] {
  const result: string[] = []
  const files = fs.readdirSync(path)
  for (const childName of files) {
    const childPath = join(path, childName)
    const stat = fs.statSync(childPath)
    if (stat.isDirectory()) {
      result.push(...recurseDirectory(childPath))
    } else {
      result.push(childPath)
    }
  }

  return result
}
