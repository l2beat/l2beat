import * as fs from 'node:fs'
import { join } from 'node:path'
import { format } from '@l2beat/discovery'
import { CliLogger } from '@l2beat/shared'

export function solFmt(fileOrDir: string) {
  const logger: CliLogger = new CliLogger()

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

  logger.logLine(`There are ${files.length} files`)
  for (const [i, file] of files.entries()) {
    if (!file.endsWith('.sol')) {
      logger.updateStatus('formatStatus', `[${i + 1}/${files.length}]`)
      continue
    }
    const start = performance.now()
    const content = fs.readFileSync(file, 'utf-8')
    const formatted = format(content)
    fs.writeFileSync(file, formatted)
    const time = performance.now() - start
    logger.updateStatus(
      'formatStatus',
      `[${i + 1}/${files.length}] : ${time.toFixed(2)} ms : ${file}`,
    )
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
