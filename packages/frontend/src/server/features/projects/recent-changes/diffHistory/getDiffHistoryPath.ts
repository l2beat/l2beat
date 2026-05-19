import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'

let projectsDir: string | undefined
let projectsDirResolved = false

export function getDiffHistoryPath(projectId: string): string | undefined {
  const projectsRoot = getProjectsDir()
  if (projectsRoot === undefined) {
    return undefined
  }

  const direct = path.join(projectsRoot, projectId, 'diffHistory.md')
  if (existsSync(direct)) {
    return direct
  }

  const queue = [projectsRoot]
  while (queue.length > 0) {
    const dir = queue.shift()
    if (dir === undefined) {
      break
    }

    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue
      }

      const fullPath = path.join(dir, entry.name)
      if (entry.name === projectId) {
        const diffHistoryPath = path.join(fullPath, 'diffHistory.md')
        if (existsSync(diffHistoryPath)) {
          return diffHistoryPath
        }
      }

      if (!existsSync(path.join(fullPath, 'config.jsonc'))) {
        queue.push(fullPath)
      }
    }
  }

  return undefined
}

function getProjectsDir(): string | undefined {
  if (projectsDirResolved) {
    return projectsDir
  }

  projectsDirResolved = true

  let dir = process.cwd()
  const root = path.parse(dir).root
  while (dir !== root) {
    const discoveryConfigPath = path.join(dir, '.discovery.json')
    if (existsSync(discoveryConfigPath)) {
      const config = JSON.parse(readFileSync(discoveryConfigPath, 'utf-8')) as {
        discovery?: string
      }
      const relativeProjectsDir = config.discovery ?? 'discovery'
      projectsDir = path.resolve(dir, relativeProjectsDir)
      return projectsDir
    }
    dir = path.dirname(dir)
  }

  return undefined
}
