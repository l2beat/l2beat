import * as fs from 'node:fs'
import { join } from 'node:path'
import { format } from '@l2beat/discovery'

export function solFmt(fileOrDir: string) {
  if (!fs.existsSync(fileOrDir)) {
    console.error('File or directory does not exist.')
  }
  const stat = fs.statSync(fileOrDir)
  if (stat.isDirectory()) {
    formatDirectory(fileOrDir)
  } else {
    formatFile(fileOrDir)
  }
}

function formatDirectory(path: string) {
  const files = fs.readdirSync(path)
  for (const childName of files) {
    const childPath = join(path, childName)
    const stat = fs.statSync(childPath)
    if (stat.isDirectory()) {
      formatDirectory(childPath)
    } else {
      formatFile(childPath)
    }
  }
}

function formatFile(path: string) {
  if (!path.endsWith('.sol')) {
    return
  }
  const start = performance.now()
  const content = fs.readFileSync(path, 'utf-8')
  const formatted = format(content)
  fs.writeFileSync(path, formatted)
  const time = performance.now() - start
  console.log(time.toFixed(2) + 'ms', path)
}
