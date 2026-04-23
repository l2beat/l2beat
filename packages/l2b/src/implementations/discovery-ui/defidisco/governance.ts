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
