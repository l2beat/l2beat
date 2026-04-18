import type { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import type { GovernanceConfig, ReviewConfig } from './types'

function readGovernanceFile(governancePath: string): GovernanceConfig {
  const fileContent = fs.readFileSync(governancePath, 'utf8')
  return JSON.parse(fileContent) as GovernanceConfig
}

function writeGovernanceFile(
  governancePath: string,
  governance: GovernanceConfig,
): void {
  const dir = path.dirname(governancePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(governancePath, JSON.stringify(governance, null, 2))
}

export function getGovernance(
  paths: DiscoveryPaths,
  project: string,
): GovernanceConfig | undefined {
  const governancePath = getGovernancePath(paths, project)

  // Primary: read from governance.json
  if (fs.existsSync(governancePath)) {
    try {
      return readGovernanceFile(governancePath)
    } catch (error) {
      console.error('Error parsing governance file:', error)
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
        governance?: GovernanceConfig
      }
      if (config.governance) {
        return config.governance
      }
    } catch (error) {
      console.error('Error reading governance from review-config.json:', error)
    }
  }

  return undefined
}

export function updateGovernance(
  paths: DiscoveryPaths,
  project: string,
  governance: GovernanceConfig | null,
): void {
  const governancePath = getGovernancePath(paths, project)

  if (governance === null) {
    if (fs.existsSync(governancePath)) {
      fs.unlinkSync(governancePath)
    }
  } else {
    writeGovernanceFile(governancePath, governance)
  }

  // One-time migration: strip governance from review-config.json if present
  const reviewConfigPath = path.join(
    paths.discovery,
    project,
    'review-config.json',
  )
  if (fs.existsSync(reviewConfigPath)) {
    try {
      const fileContent = fs.readFileSync(reviewConfigPath, 'utf8')
      const config = JSON.parse(fileContent)
      if ('governance' in config) {
        delete config.governance
        fs.writeFileSync(reviewConfigPath, JSON.stringify(config, null, 2))
      }
    } catch (error) {
      console.error(
        'Error stripping governance from review-config.json:',
        error,
      )
    }
  }
}

function getGovernancePath(paths: DiscoveryPaths, project: string): string {
  return path.join(paths.discovery, project, 'governance.json')
}

/**
 * Returns the last modification time of governance.json, derived from
 * filesystem mtime. Used by the review compiler to compute the review's
 * `lastModified` timestamp.
 *
 * governance.json has no compile-time mutation path (the compiler only reads
 * via getGovernance), so mtime is a safe signal — it only bumps when a
 * researcher explicitly saves governance via updateGovernance or the
 * /generate-governance skill.
 *
 * Returns undefined when the file does not exist (legacy projects with
 * governance embedded in review-config.json fall through to this branch).
 */
export function getGovernanceLastModified(
  paths: DiscoveryPaths,
  project: string,
): string | undefined {
  const governancePath = getGovernancePath(paths, project)
  if (!fs.existsSync(governancePath)) {
    return undefined
  }
  try {
    return fs.statSync(governancePath).mtime.toISOString()
  } catch (error) {
    console.error('Error reading governance.json mtime:', error)
    return undefined
  }
}
