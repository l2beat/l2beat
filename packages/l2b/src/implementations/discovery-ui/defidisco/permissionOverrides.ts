import { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import type {
  ApiPermissionOverridesResponse,
  ApiPermissionOverridesUpdateRequest,
  PermissionOverride,
  ContractPermissions,
  OwnerDefinition,
} from './types'

// Interface for resolved owner information
export interface ResolvedOwner {
  address: string
  source: OwnerDefinition
  isResolved: boolean
  error?: string
}

// Cache for discovered permissions to avoid repeated file parsing
const discoveredPermissionsCache = new Map<string, {
  contracts: Record<string, ContractPermissions>
  mtime: number
}>()

export function getPermissionOverrides(
  paths: DiscoveryPaths,
  project: string,
): ApiPermissionOverridesResponse {
  const overridesPath = getPermissionOverridesPath(paths, project)
  const discoveredPath = getDiscoveredPath(paths, project)

  // Load user overrides
  let userContracts: Record<string, ContractPermissions> = {}
  if (fs.existsSync(overridesPath)) {
    try {
      const fileContent = fs.readFileSync(overridesPath, 'utf8')
      const data = JSON.parse(fileContent) as ApiPermissionOverridesResponse
      userContracts = data.contracts || {}
    } catch (error) {
      console.error('Error parsing permission overrides file:', error)
    }
  }

  // Load discovered permissions and convert to contract-grouped format
  const discoveredContracts = loadDiscoveredPermissions(discoveredPath)

  // Merge: user overrides take precedence over discovered permissions
  const allContracts = mergeContractPermissions(discoveredContracts, userContracts)

  return {
    version: '1.0',
    lastModified: new Date().toISOString(),
    contracts: allContracts,
  }
}

export function updatePermissionOverride(
  paths: DiscoveryPaths,
  project: string,
  updateRequest: ApiPermissionOverridesUpdateRequest,
): void {
  const overridesPath = getPermissionOverridesPath(paths, project)

  // Load existing USER overrides only (not merged data)
  let userContracts: Record<string, ContractPermissions> = {}
  if (fs.existsSync(overridesPath)) {
    try {
      const fileContent = fs.readFileSync(overridesPath, 'utf8')
      const data = JSON.parse(fileContent) as ApiPermissionOverridesResponse
      userContracts = data.contracts || {}
    } catch (error) {
      console.error('Error parsing permission overrides file:', error)
    }
  }

  const contractAddress = updateRequest.contractAddress
  const functionName = updateRequest.functionName

  // Get or create contract entry
  if (!userContracts[contractAddress]) {
    userContracts[contractAddress] = { functions: [] }
  }

  // Find existing override for the same function
  const existingOverrideIndex = userContracts[contractAddress].functions.findIndex(
    (func) => func.functionName === functionName
  )
  const existingOverride = existingOverrideIndex >= 0 ? userContracts[contractAddress].functions[existingOverrideIndex] : undefined

  // Create new override entry, merging with existing data
  const newOverride: PermissionOverride = {
    functionName: updateRequest.functionName,
    userClassification: updateRequest.userClassification ?? existingOverride?.userClassification ?? 'non-permissioned',
    checked: updateRequest.checked ?? existingOverride?.checked,
    score: updateRequest.score ?? existingOverride?.score,
    reason: updateRequest.reason ?? existingOverride?.reason,
    description: updateRequest.description ?? existingOverride?.description,
    ownerDefinitions: updateRequest.ownerDefinitions ?? existingOverride?.ownerDefinitions,
    timestamp: new Date().toISOString(),
  }

  // Update or add the function override
  if (existingOverrideIndex >= 0) {
    userContracts[contractAddress].functions[existingOverrideIndex] = newOverride
  } else {
    userContracts[contractAddress].functions.push(newOverride)
  }

  // Create updated data
  const updatedData: ApiPermissionOverridesResponse = {
    version: '1.0',
    lastModified: new Date().toISOString(),
    contracts: userContracts,
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

function loadDiscoveredPermissions(discoveredPath: string): Record<string, ContractPermissions> {
  if (!fs.existsSync(discoveredPath)) {
    return {}
  }

  try {
    // Check cache first
    const stats = fs.statSync(discoveredPath)
    const currentMtime = stats.mtimeMs
    const cached = discoveredPermissionsCache.get(discoveredPath)

    if (cached && cached.mtime === currentMtime) {
      // Return cached result if file hasn't changed
      return cached.contracts
    }

    // File has changed or not cached, parse it
    console.log(`Parsing discovered.json for permissions (${Math.round(stats.size / 1024)}KB)...`)
    const fileContent = fs.readFileSync(discoveredPath, 'utf8')
    const discovered = JSON.parse(fileContent)
    const contracts: Record<string, ContractPermissions> = {}

    // Iterate through discovered contracts
    if (discovered.entries && Array.isArray(discovered.entries)) {
      for (const entry of discovered.entries) {
        if (entry.type === 'Contract' && entry.values?.writeFunctionPermissions) {
          const contractAddress = entry.address
          const permissions = entry.values.writeFunctionPermissions

          // Skip if it's a skipped entry
          if (Array.isArray(permissions)) {
            const functions: PermissionOverride[] = []
            for (const permission of permissions) {
              if (permission.function && permission.permissionType) {
                // Convert discovered permission to override format
                const isPermissioned = permission.permissionType === 'modifier' ||
                                     permission.permissionType === 'msgSender'

                functions.push({
                  functionName: permission.function,
                  userClassification: isPermissioned ? 'permissioned' : 'non-permissioned',
                  timestamp: new Date().toISOString(),
                  reason: `Auto-detected: ${permission.permissionType}${permission.modifiers ? ` (${permission.modifiers.join(', ')})` : ''}`,
                })
              }
            }

            if (functions.length > 0) {
              contracts[contractAddress] = { functions }
            }
          }
        }
      }
    }

    // Cache the result
    discoveredPermissionsCache.set(discoveredPath, {
      contracts,
      mtime: currentMtime
    })

    const totalFunctions = Object.values(contracts).reduce((sum, contract) => sum + contract.functions.length, 0)
    console.log(`Cached ${totalFunctions} discovered permissions across ${Object.keys(contracts).length} contracts`)
    return contracts
  } catch (error) {
    console.error('Error parsing discovered.json:', error)
    return {}
  }
}

function mergeContractPermissions(
  discoveredContracts: Record<string, ContractPermissions>,
  userContracts: Record<string, ContractPermissions>
): Record<string, ContractPermissions> {
  const result: Record<string, ContractPermissions> = {}

  // Start with discovered contracts
  for (const [contractAddress, discoveredContract] of Object.entries(discoveredContracts)) {
    const userContract = userContracts[contractAddress]

    if (!userContract) {
      // No user overrides for this contract, use discovered functions
      result[contractAddress] = { functions: [...discoveredContract.functions] }
    } else {
      // Merge discovered and user functions, user takes precedence
      const userFunctionMap = new Map<string, PermissionOverride>()

      // Index user functions by function name
      for (const func of userContract.functions) {
        userFunctionMap.set(func.functionName, func)
      }

      const mergedFunctions: PermissionOverride[] = []

      // Add discovered functions that don't have user overrides
      for (const discoveredFunc of discoveredContract.functions) {
        if (!userFunctionMap.has(discoveredFunc.functionName)) {
          mergedFunctions.push(discoveredFunc)
        }
      }

      // Add all user functions (these take precedence)
      mergedFunctions.push(...userContract.functions)

      result[contractAddress] = { functions: mergedFunctions }
    }
  }

  // Add user-only contracts (contracts that have user overrides but no discovered data)
  for (const [contractAddress, userContract] of Object.entries(userContracts)) {
    if (!discoveredContracts[contractAddress]) {
      result[contractAddress] = { functions: [...userContract.functions] }
    }
  }

  return result
}

/**
 * Resolves owner definitions using already discovered data from discovered.json.
 * This reads field values and access control data that L2BEAT has already discovered.
 */
export function resolveOwnersFromDiscovered(
  paths: DiscoveryPaths,
  project: string,
  ownerDefinitions: OwnerDefinition[]
): ResolvedOwner[] {
  const discoveredPath = getDiscoveredPath(paths, project)

  if (!fs.existsSync(discoveredPath)) {
    return ownerDefinitions.map(definition => ({
      address: 'DISCOVERY_NOT_FOUND',
      source: definition,
      isResolved: false,
      error: 'No discovered.json file found for project'
    }))
  }

  try {
    const fileContent = fs.readFileSync(discoveredPath, 'utf8')
    const discovered = JSON.parse(fileContent)

    const resolved: ResolvedOwner[] = []

    for (const definition of ownerDefinitions) {
      try {
        if (definition.type === 'field') {
          const addresses = resolveFieldFromDiscovered(discovered, definition)
          resolved.push(...addresses.map(address => ({
            address,
            source: definition,
            isResolved: true,
          })))
        } else if (definition.type === 'role') {
          const addresses = resolveRoleFromDiscovered(discovered, definition)
          resolved.push(...addresses.map(address => ({
            address,
            source: definition,
            isResolved: true,
          })))
        }
      } catch (error) {
        resolved.push({
          address: 'RESOLUTION_FAILED',
          source: definition,
          isResolved: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return resolved
  } catch (error) {
    console.error('Error parsing discovered.json:', error)
    return ownerDefinitions.map(definition => ({
      address: 'PARSE_ERROR',
      source: definition,
      isResolved: false,
      error: 'Failed to parse discovered.json'
    }))
  }
}

/**
 * Resolves field-type owner definition from discovered data.
 * Looks for the field value in the contract's discovered data.
 */
function resolveFieldFromDiscovered(discovered: any, definition: OwnerDefinition): string[] {
  if (!definition.field) {
    throw new Error('Field definition is missing')
  }

  const { contractAddress, method } = definition.field

  // Find the contract in discovered data
  if (!discovered.entries || !Array.isArray(discovered.entries)) {
    throw new Error('No entries found in discovered data')
  }

  // Debug: log what we're looking for
  console.log('Resolving field:', { contractAddress, method })
  console.log('Available contracts:', discovered.entries.map((e: any) => ({ type: e.type, address: e.address, name: e.name })))

  const contractEntry = discovered.entries.find((entry: any) =>
    entry.type === 'Contract' && entry.address === contractAddress
  )

  if (!contractEntry) {
    throw new Error(`Contract ${contractAddress} not found in discovered data`)
  }

  // Debug: log contract info
  console.log('Found contract:', { address: contractEntry.address, fieldsCount: contractEntry.fields?.length || 0 })

  // Look for the field in the contract's fields
  if (!contractEntry.fields || !Array.isArray(contractEntry.fields)) {
    throw new Error(`No fields found for contract ${contractAddress}`)
  }

  const field = contractEntry.fields.find((f: any) => f.name === method)

  if (!field) {
    throw new Error(`Field ${method} not found in contract ${contractAddress}`)
  }

  // Extract address from field value
  if (field.value && field.value.type === 'address') {
    return [field.value.address]
  }

  // Handle array of addresses
  if (field.value && field.value.type === 'array') {
    const addresses = field.value.values
      .filter((v: any) => v.type === 'address')
      .map((v: any) => v.address)
    return addresses
  }

  throw new Error(`Field ${method} does not contain address data`)
}

/**
 * Resolves role-type owner definition from discovered data.
 * Looks for AccessControl data in the contract's discovered data.
 */
function resolveRoleFromDiscovered(discovered: any, definition: OwnerDefinition): string[] {
  if (!definition.role) {
    throw new Error('Role definition is missing')
  }

  const { accessControlContract, roleName, roleHash } = definition.role

  // Find the contract in discovered data
  if (!discovered.entries || !Array.isArray(discovered.entries)) {
    throw new Error('No entries found in discovered data')
  }

  const contractEntry = discovered.entries.find((entry: any) =>
    entry.type === 'Contract' && entry.address === accessControlContract
  )

  if (!contractEntry) {
    throw new Error(`Contract ${accessControlContract} not found in discovered data`)
  }

  // Look for access control data in the contract's fields
  if (!contractEntry.fields || !Array.isArray(contractEntry.fields)) {
    throw new Error(`No fields found for contract ${accessControlContract}`)
  }

  // Look for a field that contains access control data (could be named accessControl, roles, etc.)
  const accessControlField = contractEntry.fields.find((f: any) =>
    f.handler?.type === 'accessControl' ||
    f.name?.toLowerCase().includes('accesscontrol') ||
    f.name?.toLowerCase().includes('roles')
  )

  if (!accessControlField || !accessControlField.value) {
    throw new Error(`No access control data found for contract ${accessControlContract}`)
  }

  const accessControlData = accessControlField.value

  // Handle different possible structures for access control data
  let roles: any = {}

  if (accessControlData.type === 'object' && accessControlData.values) {
    // Convert array of [key, value] pairs to object
    roles = Object.fromEntries(accessControlData.values)
  } else if (typeof accessControlData === 'object') {
    roles = accessControlData
  } else {
    throw new Error(`Unexpected access control data format`)
  }

  // Try to find the role by name first, then by hash
  let roleData = roles[roleName]
  if (!roleData && roleHash) {
    roleData = roles[roleHash]
  }

  if (!roleData) {
    // Role exists but has no members (return empty array, not an error)
    return []
  }

  // Extract members from role data
  if (roleData.members && Array.isArray(roleData.members)) {
    return roleData.members
  }

  if (Array.isArray(roleData)) {
    return roleData
  }

  throw new Error(`Unexpected role data format for ${roleName}`)
}