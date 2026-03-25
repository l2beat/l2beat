import type { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import type { ResourceEntry, ReviewConfig } from './types'

export function getResources(
  paths: DiscoveryPaths,
  project: string,
): ResourceEntry[] {
  const resourcesPath = getResourcesPath(paths, project)

  // Primary: read from resources.json
  if (fs.existsSync(resourcesPath)) {
    try {
      const fileContent = fs.readFileSync(resourcesPath, 'utf8')
      return JSON.parse(fileContent) as ResourceEntry[]
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

export function updateResources(
  paths: DiscoveryPaths,
  project: string,
  resources: ResourceEntry[],
): void {
  const resourcesPath = getResourcesPath(paths, project)

  // Ensure directory exists
  const dir = path.dirname(resourcesPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Write resources.json
  fs.writeFileSync(resourcesPath, JSON.stringify(resources, null, 2))

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

function getResourcesPath(paths: DiscoveryPaths, project: string): string {
  return path.join(paths.discovery, project, 'resources.json')
}
