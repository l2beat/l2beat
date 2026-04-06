import type { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import type { AuditEntry, ResourceEntry, ReviewConfig } from './types'

interface ResourcesFile {
  resources: ResourceEntry[]
  audits: AuditEntry[]
}

function readResourcesFile(resourcesPath: string): ResourcesFile {
  const fileContent = fs.readFileSync(resourcesPath, 'utf8')
  const parsed = JSON.parse(fileContent)

  // Legacy: bare array format (resources only, no audits)
  if (Array.isArray(parsed)) {
    return { resources: parsed as ResourceEntry[], audits: [] }
  }

  return {
    resources: (parsed.resources ?? []) as ResourceEntry[],
    audits: (parsed.audits ?? []) as AuditEntry[],
  }
}

function writeResourcesFile(resourcesPath: string, file: ResourcesFile): void {
  const dir = path.dirname(resourcesPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(resourcesPath, JSON.stringify(file, null, 2))
}

export function getResources(
  paths: DiscoveryPaths,
  project: string,
): ResourceEntry[] {
  const resourcesPath = getResourcesPath(paths, project)

  // Primary: read from resources.json
  if (fs.existsSync(resourcesPath)) {
    try {
      return readResourcesFile(resourcesPath).resources
    } catch (error) {
      console.error('Error parsing resources file:', error)
    }
  }

  // Fallback: read from review-config.json (legacy location)
  const reviewConfigPath = path.join(
    paths.discovery,
    project,
    'review-config.json',
  )
  if (fs.existsSync(reviewConfigPath)) {
    try {
      const fileContent = fs.readFileSync(reviewConfigPath, 'utf8')
      const config = JSON.parse(fileContent) as ReviewConfig & {
        resources?: ResourceEntry[]
      }
      if (config.resources && config.resources.length > 0) {
        return config.resources
      }
    } catch (error) {
      console.error('Error reading resources from review-config.json:', error)
    }
  }

  return []
}

export function getAudits(
  paths: DiscoveryPaths,
  project: string,
): AuditEntry[] {
  const resourcesPath = getResourcesPath(paths, project)

  if (fs.existsSync(resourcesPath)) {
    try {
      return readResourcesFile(resourcesPath).audits
    } catch (error) {
      console.error('Error parsing audits from resources file:', error)
    }
  }

  return []
}

export function updateResources(
  paths: DiscoveryPaths,
  project: string,
  resources: ResourceEntry[],
): void {
  const resourcesPath = getResourcesPath(paths, project)

  // Preserve existing audits when updating resources
  let existingAudits: AuditEntry[] = []
  if (fs.existsSync(resourcesPath)) {
    try {
      existingAudits = readResourcesFile(resourcesPath).audits
    } catch (_) {
      // ignore parse errors — start fresh
    }
  }

  writeResourcesFile(resourcesPath, { resources, audits: existingAudits })

  // One-time migration: strip resources from review-config.json if present
  const reviewConfigPath = path.join(
    paths.discovery,
    project,
    'review-config.json',
  )
  if (fs.existsSync(reviewConfigPath)) {
    try {
      const fileContent = fs.readFileSync(reviewConfigPath, 'utf8')
      const config = JSON.parse(fileContent)
      if ('resources' in config) {
        delete config.resources
        fs.writeFileSync(reviewConfigPath, JSON.stringify(config, null, 2))
      }
    } catch (error) {
      console.error('Error stripping resources from review-config.json:', error)
    }
  }
}

export function updateAudits(
  paths: DiscoveryPaths,
  project: string,
  audits: AuditEntry[],
): void {
  const resourcesPath = getResourcesPath(paths, project)

  // Preserve existing resources when updating audits
  let existingResources: ResourceEntry[] = []
  if (fs.existsSync(resourcesPath)) {
    try {
      existingResources = readResourcesFile(resourcesPath).resources
    } catch (_) {
      // ignore parse errors — start fresh
    }
  }

  writeResourcesFile(resourcesPath, {
    resources: existingResources,
    audits,
  })
}

function getResourcesPath(paths: DiscoveryPaths, project: string): string {
  return path.join(paths.discovery, project, 'resources.json')
}
