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

// Interface for resolved delay information
export interface ResolvedDelay {
  seconds: number
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
    delay: updateRequest.delay !== undefined ? updateRequest.delay : existingOverride?.delay,
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
 * Resolves owner definitions using unified path expressions:
 * Path format: <contractRef>.<valuePath>
 * - $self: current contract
 * - @fieldName: follow address field in current contract
 * - eth:0xAddress: absolute contract address
 */
export function resolveOwnersFromDiscovered(
  paths: DiscoveryPaths,
  project: string,
  contractAddress: string,
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
        const addresses = resolvePathExpression(discovered, contractAddress, definition.path)
        resolved.push(...addresses.map(address => ({
          address,
          source: definition,
          isResolved: true,
        })))
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
 * Resolves a path expression to owner addresses
 * Path format: <contractRef>.<valuePath>
 * Examples:
 *   "$self.owner" → owner in current contract
 *   "@governor.signers[0]" → follow governor field, get first signer
 *   "eth:0x123.accessControl.ADMIN.members" → absolute address, get role members
 */
function resolvePathExpression(
  discovered: any,
  currentContractAddress: string,
  pathExpression: string
): string[] {
  if (!discovered.entries || !Array.isArray(discovered.entries)) {
    throw new Error('No entries found in discovered data')
  }

  // Parse path expression: <contractRef>.<valuePath>
  // Special case: just "$self" means current contract is the owner
  if (pathExpression === '$self') {
    return [currentContractAddress]
  }

  // Split on first dot to separate contract ref from value path
  const firstDotIndex = pathExpression.indexOf('.')

  if (firstDotIndex === -1) {
    throw new Error(`Invalid path expression "${pathExpression}": must include contract reference and value path`)
  }

  const contractRef = pathExpression.substring(0, firstDotIndex)
  const valuePath = pathExpression.substring(firstDotIndex + 1)

  // Resolve contract reference to actual contract address
  let targetContractAddress: string

  if (contractRef === '$self') {
    // Current contract
    targetContractAddress = currentContractAddress
  } else if (contractRef.startsWith('@')) {
    // Follow an address field in current contract
    const fieldName = contractRef.substring(1) // Remove @ prefix
    const currentContract = findContract(discovered, currentContractAddress)
    targetContractAddress = getFieldValue(currentContract, fieldName)

    if (!targetContractAddress || typeof targetContractAddress !== 'string' || !targetContractAddress.startsWith('eth:')) {
      throw new Error(`Field "${fieldName}" not found or is not an address in current contract`)
    }
  } else if (contractRef.startsWith('eth:')) {
    // Absolute contract address
    targetContractAddress = contractRef
  } else {
    throw new Error(`Invalid contract reference "${contractRef}": must be $self, @fieldName, or eth:0xAddress`)
  }

  // Find target contract
  const targetContract = findContract(discovered, targetContractAddress)

  // Navigate value path in contract.values
  return navigateValuePath(targetContract, valuePath)
}

/**
 * Finds a contract in discovered data by address
 */
function findContract(discovered: any, contractAddress: string): any {
  const contract = discovered.entries.find((entry: any) =>
    entry.type === 'Contract' && entry.address === contractAddress
  )

  if (!contract) {
    const available = discovered.entries
      .filter((e: any) => e.type === 'Contract')
      .map((e: any) => e.address)
      .slice(0, 5)
      .join(', ')
    throw new Error(`Contract ${contractAddress} not found. Available: ${available}...`)
  }

  return contract
}

/**
 * Gets a field value from a contract's values object
 */
function getFieldValue(contract: any, fieldName: string): any {
  if (!contract.values || typeof contract.values !== 'object') {
    throw new Error('Contract has no values')
  }

  const value = contract.values[fieldName]

  if (value === undefined) {
    throw new Error(`Field ${fieldName} not found in contract values`)
  }

  // Handle string addresses (most common case)
  if (typeof value === 'string' && value.startsWith('eth:')) {
    return value
  }

  // Handle complex field value objects
  if (typeof value === 'object' && value.type === 'address') {
    return value.address
  }

  return value
}

/**
 * Navigates a value path in contract.values to extract addresses
 * Supports any structure with JSONPath-like navigation:
 * - Simple fields: "owner"
 * - Nested objects: "accessControl.DEFAULT_ADMIN_ROLE.members"
 * - Array indices: "signers[0]"
 * - Dynamic keys: "permissions[eth:0x123][0xROLE].entities"
 * - Mixed: "governance.roles[ADMIN_ROLE][0]"
 */
function navigateValuePath(contract: any, valuePath: string): string[] {
  if (!contract.values || typeof contract.values !== 'object') {
    throw new Error('Contract has no values')
  }

  // Parse and navigate the path
  let currentValue: any = contract.values
  const segments = parseValuePath(valuePath)

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]!

    if (segment.type === 'property') {
      // Navigate object property
      if (typeof currentValue !== 'object' || currentValue === null) {
        throw new Error(`Cannot access property "${segment.value}" on non-object at path segment ${i}`)
      }
      currentValue = currentValue[segment.value]
      if (currentValue === undefined) {
        const available = Object.keys(currentValue || {}).slice(0, 5).join(', ')
        throw new Error(`Property "${segment.value}" not found. Available: ${available}`)
      }
    } else if (segment.type === 'index') {
      // Navigate array index
      if (!Array.isArray(currentValue)) {
        throw new Error(`Cannot index non-array at path segment ${i}`)
      }
      const index = segment.value as number
      if (index >= currentValue.length) {
        throw new Error(`Index ${index} out of bounds (length: ${currentValue.length})`)
      }
      currentValue = currentValue[index]
    }
  }

  // Extract addresses from the final value
  return extractAddresses(currentValue, valuePath)
}

/**
 * Parses a value path into segments
 * Examples:
 *   "owner" → [{type: 'property', value: 'owner'}]
 *   "signers[0]" → [{type: 'property', value: 'signers'}, {type: 'index', value: 0}]
 *   "accessControl.ADMIN.members" → [{type: 'property', value: 'accessControl'}, {type: 'property', value: 'ADMIN'}, {type: 'property', value: 'members'}]
 */
function parseValuePath(path: string): Array<{ type: 'property' | 'index'; value: string | number }> {
  const segments: Array<{ type: 'property' | 'index'; value: string | number }> = []
  let current = ''
  let i = 0

  while (i < path.length) {
    const char = path[i]!

    if (char === '.') {
      // Property separator
      if (current) {
        segments.push({ type: 'property', value: current })
        current = ''
      }
      i++
    } else if (char === '[') {
      // Start of array index
      if (current) {
        segments.push({ type: 'property', value: current })
        current = ''
      }

      // Find closing bracket
      const closeIndex = path.indexOf(']', i)
      if (closeIndex === -1) {
        throw new Error(`Unclosed bracket in path: ${path}`)
      }

      const indexStr = path.substring(i + 1, closeIndex)
      const index = parseInt(indexStr, 10)

      if (isNaN(index)) {
        // Not a numeric index, treat as property key (e.g., [eth:0x123] or [ROLE])
        segments.push({ type: 'property', value: indexStr })
      } else {
        segments.push({ type: 'index', value: index })
      }

      i = closeIndex + 1
    } else {
      current += char
      i++
    }
  }

  // Add final segment
  if (current) {
    segments.push({ type: 'property', value: current })
  }

  return segments
}

/**
 * Extracts address strings from a value (can be string, array, or object)
 */
function extractAddresses(value: any, path: string): string[] {
  // Single string address
  if (typeof value === 'string' && value.startsWith('eth:')) {
    return [value]
  }

  // Array of addresses
  if (Array.isArray(value)) {
    const addresses: string[] = []
    for (const element of value) {
      if (typeof element === 'string' && element.startsWith('eth:')) {
        addresses.push(element)
      }
    }
    if (addresses.length > 0) {
      return addresses
    }
  }

  throw new Error(`Value at path "${path}" is not an address or array of addresses`)
}

/**
 * Resolves a delay field value from discovered data.
 * Extracts numeric value from a contract field and returns it in seconds.
 */
export function resolveDelayFromDiscovered(
  paths: DiscoveryPaths,
  project: string,
  delayRef: { contractAddress: string; fieldName: string }
): ResolvedDelay {
  const discoveredPath = getDiscoveredPath(paths, project)

  if (!fs.existsSync(discoveredPath)) {
    return {
      seconds: 0,
      isResolved: false,
      error: 'No discovered.json file found for project'
    }
  }

  try {
    const fileContent = fs.readFileSync(discoveredPath, 'utf8')
    const discovered = JSON.parse(fileContent)

    // Find the contract in discovered data
    if (!discovered.entries || !Array.isArray(discovered.entries)) {
      return {
        seconds: 0,
        isResolved: false,
        error: 'No entries found in discovered data'
      }
    }

    const contractEntry = discovered.entries.find((entry: any) =>
      entry.type === 'Contract' && entry.address === delayRef.contractAddress
    )

    if (!contractEntry) {
      return {
        seconds: 0,
        isResolved: false,
        error: `Contract ${delayRef.contractAddress} not found in discovered data`
      }
    }

    // Look for the field in the contract's fields
    if (!contractEntry.fields || !Array.isArray(contractEntry.fields)) {
      return {
        seconds: 0,
        isResolved: false,
        error: `No fields found for contract ${delayRef.contractAddress}`
      }
    }

    const field = contractEntry.fields.find((f: any) => f.name === delayRef.fieldName)

    if (!field) {
      return {
        seconds: 0,
        isResolved: false,
        error: `Field ${delayRef.fieldName} not found in contract ${delayRef.contractAddress}`
      }
    }

    // Extract numeric value from field
    if (field.value && field.value.type === 'number') {
      // Parse the string value to a number
      const numValue = parseInt(field.value.value, 10)
      if (isNaN(numValue)) {
        return {
          seconds: 0,
          isResolved: false,
          error: `Field ${delayRef.fieldName} contains non-numeric value`
        }
      }
      return {
        seconds: numValue,
        isResolved: true
      }
    }

    return {
      seconds: 0,
      isResolved: false,
      error: `Field ${delayRef.fieldName} is not a number type`
    }
  } catch (error) {
    console.error('Error parsing discovered.json:', error)
    return {
      seconds: 0,
      isResolved: false,
      error: 'Failed to parse discovered.json'
    }
  }
}