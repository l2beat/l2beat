import { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import type {
  ApiPermissionOverridesResponse,
  ApiPermissionOverridesUpdateRequest,
  PermissionOverride,
} from './types'

// Cache for discovered permissions to avoid repeated file parsing
const discoveredPermissionsCache = new Map<string, {
  permissions: PermissionOverride[]
  mtime: number
}>()

export function getPermissionOverrides(
  paths: DiscoveryPaths,
  project: string,
): ApiPermissionOverridesResponse {
  const overridesPath = getPermissionOverridesPath(paths, project)
  const discoveredPath = getDiscoveredPath(paths, project)

  // Load user overrides
  let userOverrides: PermissionOverride[] = []
  if (fs.existsSync(overridesPath)) {
    try {
      const fileContent = fs.readFileSync(overridesPath, 'utf8')
      const data = JSON.parse(fileContent) as ApiPermissionOverridesResponse
      userOverrides = data.overrides
    } catch (error) {
      console.error('Error parsing permission overrides file:', error)
    }
  }

  // Load discovered permissions and convert to overrides
  const discoveredOverrides = loadDiscoveredPermissions(discoveredPath)

  // Merge: user overrides take precedence over discovered permissions
  const allOverrides = mergeOverrides(discoveredOverrides, userOverrides)

  return {
    version: '1.0',
    lastModified: new Date().toISOString(),
    overrides: allOverrides,
  }
}

export function updatePermissionOverride(
  paths: DiscoveryPaths,
  project: string,
  updateRequest: ApiPermissionOverridesUpdateRequest,
): void {
  const overridesPath = getPermissionOverridesPath(paths, project)

  // Load existing USER overrides only (not merged data)
  let userOverrides: PermissionOverride[] = []
  if (fs.existsSync(overridesPath)) {
    try {
      const fileContent = fs.readFileSync(overridesPath, 'utf8')
      const data = JSON.parse(fileContent) as ApiPermissionOverridesResponse
      userOverrides = data.overrides
    } catch (error) {
      console.error('Error parsing permission overrides file:', error)
    }
  }

  // Find existing override for the same contract/function
  const existingOverride = userOverrides.find(
    (override) =>
      override.contractAddress === updateRequest.contractAddress &&
      override.functionName === updateRequest.functionName
  )

  // Create new override entry, merging with existing data
  const newOverride: PermissionOverride = {
    contractAddress: updateRequest.contractAddress,
    functionName: updateRequest.functionName,
    userClassification: updateRequest.userClassification ?? existingOverride?.userClassification ?? 'non-permissioned',
    checked: updateRequest.checked ?? existingOverride?.checked,
    score: updateRequest.score ?? existingOverride?.score,
    reason: updateRequest.reason ?? existingOverride?.reason,
    timestamp: new Date().toISOString(),
  }

  // Remove any existing override for the same contract/function
  const filteredOverrides = userOverrides.filter(
    (override) =>
      !(
        override.contractAddress === updateRequest.contractAddress &&
        override.functionName === updateRequest.functionName
      ),
  )

  // Add the new override
  const updatedData: ApiPermissionOverridesResponse = {
    version: '1.0',
    lastModified: new Date().toISOString(),
    overrides: [...filteredOverrides, newOverride],
  }

  // Ensure directory exists
  const dir = path.dirname(overridesPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Write updated data
  fs.writeFileSync(overridesPath, JSON.stringify(updatedData, null, 2))
}

function getPermissionOverridesPath(
  paths: DiscoveryPaths,
  project: string,
): string {
  // The discovery path points to packages/config/src/projects
  return path.join(
    paths.discovery,
    project,
    'permission-overrides.json',
  )
}

function getDiscoveredPath(
  paths: DiscoveryPaths,
  project: string,
): string {
  return path.join(
    paths.discovery,
    project,
    'discovered.json',
  )
}

function loadDiscoveredPermissions(discoveredPath: string): PermissionOverride[] {
  if (!fs.existsSync(discoveredPath)) {
    return []
  }

  try {
    // Check cache first
    const stats = fs.statSync(discoveredPath)
    const currentMtime = stats.mtimeMs
    const cached = discoveredPermissionsCache.get(discoveredPath)

    if (cached && cached.mtime === currentMtime) {
      // Return cached result if file hasn't changed
      return cached.permissions
    }

    // File has changed or not cached, parse it
    console.log(`Parsing discovered.json for permissions (${Math.round(stats.size / 1024)}KB)...`)
    const fileContent = fs.readFileSync(discoveredPath, 'utf8')
    const discovered = JSON.parse(fileContent)
    const overrides: PermissionOverride[] = []

    // Iterate through discovered contracts
    if (discovered.entries && Array.isArray(discovered.entries)) {
      for (const entry of discovered.entries) {
        if (entry.type === 'Contract' && entry.values?.writeFunctionPermissions) {
          const contractAddress = entry.address
          const permissions = entry.values.writeFunctionPermissions

          // Skip if it's a skipped entry
          if (Array.isArray(permissions)) {
            for (const permission of permissions) {
              if (permission.function && permission.permissionType) {
                // Convert discovered permission to override format
                const isPermissioned = permission.permissionType === 'modifier' ||
                                     permission.permissionType === 'msgSender'

                overrides.push({
                  contractAddress,
                  functionName: permission.function,
                  userClassification: isPermissioned ? 'permissioned' : 'non-permissioned',
                  timestamp: new Date().toISOString(),
                  reason: `Auto-detected: ${permission.permissionType}${permission.modifiers ? ` (${permission.modifiers.join(', ')})` : ''}`,
                })
              }
            }
          }
        }
      }
    }

    // Cache the result
    discoveredPermissionsCache.set(discoveredPath, {
      permissions: overrides,
      mtime: currentMtime
    })

    console.log(`Cached ${overrides.length} discovered permissions`)
    return overrides
  } catch (error) {
    console.error('Error parsing discovered.json:', error)
    return []
  }
}

function mergeOverrides(
  discoveredOverrides: PermissionOverride[],
  userOverrides: PermissionOverride[]
): PermissionOverride[] {
  const result: PermissionOverride[] = []
  const userOverrideMap = new Map<string, PermissionOverride>()

  // Index user overrides by contractAddress:functionName
  for (const override of userOverrides) {
    const key = `${override.contractAddress}:${override.functionName}`
    userOverrideMap.set(key, override)
  }

  // Add all discovered overrides, but skip if user has overridden
  for (const discovered of discoveredOverrides) {
    const key = `${discovered.contractAddress}:${discovered.functionName}`
    if (!userOverrideMap.has(key)) {
      result.push(discovered)
    }
  }

  // Add all user overrides (these take precedence)
  result.push(...userOverrides)

  return result
}