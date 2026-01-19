import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

interface DeFiDiscoConfig {
  version: string
  description: string
  defiProjects: string[]
  lastUpdated: string
}

let cachedConfig: DeFiDiscoConfig | null = null

function getConfigPath(): string {
  return join(__dirname, '../../../../../config/src/defidisco-config.json')
}

function loadDeFiDiscoConfig(): DeFiDiscoConfig {
  if (cachedConfig) {
    return cachedConfig
  }

  try {
    const configPath = getConfigPath()

    // Create default config if file doesn't exist
    if (!existsSync(configPath)) {
      const defaultConfig: DeFiDiscoConfig = {
        version: '1.0',
        description: 'DeFiDisco configuration for DeFi project filtering',
        defiProjects: [],
        lastUpdated: new Date().toISOString().split('T')[0],
      }

      writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2) + '\n', 'utf-8')
      cachedConfig = defaultConfig
      return defaultConfig
    }

    const configContent = readFileSync(configPath, 'utf-8')
    cachedConfig = JSON.parse(configContent)
    return cachedConfig!
  } catch (error) {
    console.warn(
      'Failed to load DeFiDisco config, falling back to all projects:',
      error,
    )
    // Fallback to allow all projects if config fails to load
    return {
      version: '1.0',
      description: 'Fallback config',
      defiProjects: [],
      lastUpdated: new Date().toISOString(),
    }
  }
}

export function getDefiProjects(): string[] {
  const config = loadDeFiDiscoConfig()
  return config.defiProjects
}

export function isDefiProject(projectId: string): boolean {
  const defiProjects = getDefiProjects()
  return defiProjects.length === 0 || defiProjects.includes(projectId)
}

export function filterDefiProjects<T extends { id?: string; name?: string }>(
  projects: T[],
  projectKey: keyof T = 'id' as keyof T,
): T[] {
  const defiProjects = getDefiProjects()

  // If no DeFi projects configured, return all projects (fallback behavior)
  if (defiProjects.length === 0) {
    return projects
  }

  return projects.filter((project) => {
    const projectId = project[projectKey] as string
    return projectId && defiProjects.includes(projectId)
  })
}

/**
 * Adds a project to the defidisco-config.json whitelist
 * This ensures newly created projects appear in the project menu
 */
export function addProjectToWhitelist(projectId: string): void {
  const configPath = getConfigPath()

  // Clear cache to force reload
  cachedConfig = null
  const config = loadDeFiDiscoConfig()

  // Check if already in list
  if (config.defiProjects.includes(projectId)) {
    return // Already exists
  }

  // Add to list
  config.defiProjects.push(projectId)
  config.lastUpdated = new Date().toISOString().split('T')[0]

  // Write back to file
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8')

  // Update cache
  cachedConfig = config
}
