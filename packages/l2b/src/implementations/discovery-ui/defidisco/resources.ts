import type { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import type { AuditEntry, ResourceEntry, ReviewConfig } from './types'

interface ResourcesFile {
  resources: ResourceEntry[]
  audits: AuditEntry[]
  linesOfCode?: number
  /** Last time a researcher edited resources or audits. NOT bumped by
   *  auto-populated linesOfCode writes (those are a compile-time side effect). */
  lastModified?: string
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
    linesOfCode: parsed.linesOfCode as number | undefined,
    lastModified: parsed.lastModified as string | undefined,
  }
}

function writeResourcesFile(
  resourcesPath: string,
  file: ResourcesFile,
  options: { bumpLastModified: boolean },
): void {
  const dir = path.dirname(resourcesPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  const lastModified = options.bumpLastModified
    ? new Date().toISOString()
    : file.lastModified
  const out: Record<string, unknown> = {
    resources: file.resources,
    audits: file.audits,
  }
  if (file.linesOfCode !== undefined) {
    out.linesOfCode = file.linesOfCode
  }
  if (lastModified !== undefined) {
    out.lastModified = lastModified
  }
  fs.writeFileSync(resourcesPath, JSON.stringify(out, null, 2))
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

  // Preserve existing audits and linesOfCode when updating resources
  let existingAudits: AuditEntry[] = []
  let existingLinesOfCode: number | undefined
  if (fs.existsSync(resourcesPath)) {
    try {
      const existing = readResourcesFile(resourcesPath)
      existingAudits = existing.audits
      existingLinesOfCode = existing.linesOfCode
    } catch (_) {
      // ignore parse errors — start fresh
    }
  }

  writeResourcesFile(
    resourcesPath,
    {
      resources,
      audits: existingAudits,
      linesOfCode: existingLinesOfCode,
    },
    { bumpLastModified: true },
  )

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

  // Preserve existing resources and linesOfCode when updating audits
  let existingResources: ResourceEntry[] = []
  let existingLinesOfCode: number | undefined
  if (fs.existsSync(resourcesPath)) {
    try {
      const existing = readResourcesFile(resourcesPath)
      existingResources = existing.resources
      existingLinesOfCode = existing.linesOfCode
    } catch (_) {
      // ignore parse errors — start fresh
    }
  }

  writeResourcesFile(
    resourcesPath,
    {
      resources: existingResources,
      audits,
      linesOfCode: existingLinesOfCode,
    },
    { bumpLastModified: true },
  )
}

export function getLinesOfCode(
  paths: DiscoveryPaths,
  project: string,
): number | undefined {
  const resourcesPath = getResourcesPath(paths, project)

  if (fs.existsSync(resourcesPath)) {
    try {
      return readResourcesFile(resourcesPath).linesOfCode
    } catch (error) {
      console.error('Error reading linesOfCode from resources file:', error)
    }
  }

  return undefined
}

export function updateLinesOfCode(
  paths: DiscoveryPaths,
  project: string,
  linesOfCode: number,
): void {
  const resourcesPath = getResourcesPath(paths, project)

  let existingResources: ResourceEntry[] = []
  let existingAudits: AuditEntry[] = []
  let existingLastModified: string | undefined
  if (fs.existsSync(resourcesPath)) {
    try {
      const existing = readResourcesFile(resourcesPath)
      existingResources = existing.resources
      existingAudits = existing.audits
      existingLastModified = existing.lastModified
    } catch (_) {
      // ignore parse errors — start fresh
    }
  }

  // LoC is produced automatically by the compiler — do NOT bump lastModified
  // here, otherwise every compile would silently re-stamp the review as
  // "just updated" and defeat the distinction between researcher edits and
  // compile-time side effects.
  writeResourcesFile(
    resourcesPath,
    {
      resources: existingResources,
      audits: existingAudits,
      linesOfCode,
      lastModified: existingLastModified,
    },
    { bumpLastModified: false },
  )
}

export function getResourcesLastModified(
  paths: DiscoveryPaths,
  project: string,
): string | undefined {
  const resourcesPath = getResourcesPath(paths, project)

  if (fs.existsSync(resourcesPath)) {
    try {
      return readResourcesFile(resourcesPath).lastModified
    } catch (error) {
      console.error('Error reading lastModified from resources file:', error)
    }
  }

  return undefined
}

function getResourcesPath(paths: DiscoveryPaths, project: string): string {
  return path.join(paths.discovery, project, 'resources.json')
}
