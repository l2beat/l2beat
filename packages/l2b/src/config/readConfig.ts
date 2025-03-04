import { existsSync, readFileSync } from 'fs'
import path from 'path'

export interface Config {
  projectRootPath?: string
  discoveryPath?: string
}

const CONFIG_FILENAME = '.l2b'

function isRootPath(p: string) {
  const normalizedPath = path.normalize(p)
  return normalizedPath === path.parse(p).root
}

function getConfigPath(): string | undefined {
  let currentDirectory = process.cwd()
  while (true) {
    const filePath = path.join(currentDirectory, CONFIG_FILENAME)
    if (existsSync(filePath)) {
      return filePath
    }

    if (isRootPath(currentDirectory)) {
      break
    }

    currentDirectory = path.dirname(currentDirectory)
  }

  return undefined
}

function filterComments(lines: string[]): string[] {
  return lines.filter((l) => !l.startsWith('#'))
}

export function readConfig(): Config {
  const defaultConfig: Config = {}

  const configFilePath = getConfigPath()
  if (configFilePath === undefined) {
    return defaultConfig
  }

  const projectRootPath = path.dirname(configFilePath)
  let discoveryPath: string | undefined
  const content = readFileSync(configFilePath, 'utf8')
  const lines = filterComments(content.split('\n'))
  for (const line of lines) {
    const index = line.indexOf('=')
    const key = line.substring(0, index)
    const value = line.substring(index + 1)

    switch (key) {
      case 'DISCOVERY_PATH': {
        discoveryPath = path.join(projectRootPath, value)
        break
      }
    }
  }

  return {
    ...defaultConfig,
    discoveryPath,
    projectRootPath,
  }
}
