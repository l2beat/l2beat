import type { Database } from '@l2beat/database'
import type { DiscoveryOutput } from '@l2beat/discovery'
import { UnixTime } from '@l2beat/shared-pure'
import { readFileSync } from 'fs'
import { join } from 'path'
import type { Logger } from '@l2beat/backend-tools'
import {
  DiscoveredDataAccess,
  resolvePathExpression,
} from './ownerResolution'
import type {
  EnrichedAddress,
  FunctionsJson,
  PermissionChange,
  ResolutionBlob,
  ResolvedContract,
  ResolvedFunction,
} from './types'

export class PermissionResolver {
  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
    private readonly configBasePath: string,
    private readonly notifyCallback?: (
      projectId: string,
      timestamp: UnixTime,
    ) => Promise<void>,
  ) {}

  /**
   * Main entry point: resolve all permissions and detect changes
   * Only called when discovery diff is detected
   */
  async resolveAndCompare(
    projectId: string,
    discovery: DiscoveryOutput,
    timestamp: UnixTime,
  ): Promise<void> {
    try {
      // Check if functions.json exists for this project
      const functionsPath = this.getFunctionsPath(projectId)
      if (!this.fileExists(functionsPath)) {
        this.logger.debug('No functions.json found, skipping resolution', {
          projectId,
        })
        return
      }

      // Load functions.json
      const functionsData = this.loadFunctionsJson(functionsPath)
      if (!functionsData.contracts || Object.keys(functionsData.contracts).length === 0) {
        this.logger.debug('No permissioned functions configured', { projectId })
        return
      }

      // Create data access for resolution
      const dataAccess = new DiscoveredDataAccess(discovery)

      // Build contract name map for enrichment
      const contractNames = new Map<string, string>()
      for (const entry of discovery.entries) {
        if (entry.type === 'Contract' && entry.name) {
          contractNames.set(entry.address, entry.name)
        }
      }

      // Resolve all permissioned functions
      const resolutionData = this.resolveAllFunctions(
        functionsData,
        dataAccess,
        timestamp,
        contractNames,
      )

      // Store current resolution in database
      await this.db.permissionResolution.insert({
        projectId,
        timestamp,
        resolutionBlob: resolutionData,
      })

      this.logger.info('Permissions resolved and stored', {
        projectId,
        contractCount: Object.keys(resolutionData.contracts).length,
      })

      // Detect and store changes
      await this.detectAndStoreChanges(projectId, resolutionData, timestamp)
    } catch (error) {
      this.logger.error('Failed to resolve permissions', {
        projectId,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * Resolve all permissioned functions to owner addresses
   */
  private resolveAllFunctions(
    functionsData: FunctionsJson,
    dataAccess: DiscoveredDataAccess,
    timestamp: UnixTime,
    contractNames: Map<string, string>,
  ): ResolutionBlob {
    const contracts: Record<string, ResolvedContract> = {}

    for (const [contractAddress, contractData] of Object.entries(
      functionsData.contracts,
    )) {
      const resolvedFunctions: ResolvedFunction[] = []

      for (const func of contractData.functions) {
        // Only resolve permissioned functions
        if (!func.isPermissioned) continue

        const allOwners: string[] = []
        const resolutionErrors: string[] = []
        const ownerResolutions = []

        // Resolve each owner definition path
        if (func.ownerDefinitions && func.ownerDefinitions.length > 0) {
          for (const ownerDef of func.ownerDefinitions) {
            try {
              const result = resolvePathExpression(
                dataAccess,
                contractAddress,
                ownerDef.path,
              )

              ownerResolutions.push({
                path: ownerDef.path,
                addresses: result.addresses,
                error: result.error || null,
              })

              if (result.error) {
                resolutionErrors.push(`${ownerDef.path}: ${result.error}`)
              } else {
                // Collect unique addresses
                for (const addr of result.addresses) {
                  if (!allOwners.includes(addr)) {
                    allOwners.push(addr)
                  }
                }
              }
            } catch (error) {
              const errorMsg =
                error instanceof Error ? error.message : String(error)
              resolutionErrors.push(`${ownerDef.path}: ${errorMsg}`)
              ownerResolutions.push({
                path: ownerDef.path,
                addresses: [],
                error: errorMsg,
              })
            }
          }
        }

        resolvedFunctions.push({
          functionName: func.functionName,
          ownerResolutions,
          allOwners,
          resolutionErrors,
        })
      }

      if (resolvedFunctions.length > 0) {
        contracts[contractAddress] = {
          contractName: contractNames.get(contractAddress) || 'Unknown',
          functions: resolvedFunctions,
        }
      }
    }

    return {
      version: '1.0',
      resolvedAt: UnixTime.toDate(timestamp).toISOString(),
      contracts,
    }
  }

  /**
   * Detect changes by comparing with previous resolution
   */
  private async detectAndStoreChanges(
    projectId: string,
    currentResolution: ResolutionBlob,
    timestamp: UnixTime,
  ): Promise<void> {
    // Get previous resolution
    const previousRecord =
      await this.db.permissionResolution.findLatest(projectId)

    if (!previousRecord) {
      this.logger.info('First permission resolution, no changes to detect', {
        projectId,
      })
      return
    }

    const previousResolution = previousRecord.resolutionBlob as ResolutionBlob

    // Compare resolutions
    const changes = this.compareResolutions(
      previousResolution,
      currentResolution,
    )

    if (changes.length === 0) {
      this.logger.info('No permission changes detected', { projectId })
      return
    }

    // Store changes in UpdateDiff
    const updateDiffRecords = changes.map((change) => ({
      projectId,
      type: 'permissionChange' as const,
      address: change.contractAddress,
      timestamp,
      diffBaseTimestamp: previousRecord.timestamp,
      diffHeadTimestamp: timestamp,
      details: {
        functionName: change.functionName,
        changes: change.changes,
        resolutionErrors: change.resolutionErrors,
      },
    }))

    await this.db.updateDiff.insertMany(updateDiffRecords)

    this.logger.info('Permission changes detected and stored', {
      projectId,
      changeCount: changes.length,
    })

    // Trigger notification if callback is provided
    if (this.notifyCallback) {
      await this.notifyCallback(projectId, timestamp)
    }
  }

  /**
   * Compare two resolution blobs and identify ownership changes
   */
  private compareResolutions(
    previous: ResolutionBlob,
    current: ResolutionBlob,
  ): PermissionChange[] {
    const changes: PermissionChange[] = []

    // Get all contracts from both resolutions
    const allContracts = new Set([
      ...Object.keys(previous.contracts),
      ...Object.keys(current.contracts),
    ])

    for (const contractAddress of allContracts) {
      const prevContract = previous.contracts[contractAddress]
      const currContract = current.contracts[contractAddress]

      // Build function maps
      const prevFunctions = new Map(
        prevContract?.functions.map((f) => [f.functionName, f]) || [],
      )
      const currFunctions = new Map(
        currContract?.functions.map((f) => [f.functionName, f]) || [],
      )

      // Get all function names
      const allFunctionNames = new Set([
        ...prevFunctions.keys(),
        ...currFunctions.keys(),
      ])

      for (const functionName of allFunctionNames) {
        const prevFunc = prevFunctions.get(functionName)
        const currFunc = currFunctions.get(functionName)

        if (!prevFunc && currFunc) {
          // New permissioned function - this is a config change, skip it
          continue
        } else if (prevFunc && !currFunc) {
          // Removed permissioned function - this is a config change, skip it
          continue
        } else if (prevFunc && currFunc) {
          // Compare owner sets
          const prevOwners = new Set(prevFunc.allOwners)
          const currOwners = new Set(currFunc.allOwners)

          const addedOwners = [...currOwners].filter((o) => !prevOwners.has(o))
          const removedOwners = [...prevOwners].filter(
            (o) => !currOwners.has(o),
          )

          if (addedOwners.length > 0 || removedOwners.length > 0) {
            changes.push({
              contractAddress,
              contractName: currContract?.contractName || 'Unknown',
              functionName,
              changes: {
                addedOwners: this.toEnrichedAddresses(
                  addedOwners,
                  current.contracts,
                ),
                removedOwners: this.toEnrichedAddresses(
                  removedOwners,
                  previous.contracts,
                ),
              },
              resolutionErrors: currFunc.resolutionErrors || [],
            })
          }
        }
      }
    }

    return changes
  }

  /**
   * Convert addresses to enriched format with contract names
   */
  private toEnrichedAddresses(
    addresses: string[],
    contracts: Record<string, ResolvedContract>,
  ): EnrichedAddress[] {
    return addresses.map((address) => ({
      address,
      name: contracts[address]?.contractName || 'Unknown',
    }))
  }

  /**
   * Get path to functions.json for a project
   */
  private getFunctionsPath(projectId: string): string {
    return join(this.configBasePath, projectId, 'functions.json')
  }

  /**
   * Check if a file exists
   */
  private fileExists(path: string): boolean {
    try {
      readFileSync(path, 'utf-8')
      return true
    } catch {
      return false
    }
  }

  /**
   * Load and parse functions.json
   */
  private loadFunctionsJson(path: string): FunctionsJson {
    const content = readFileSync(path, 'utf-8')
    return JSON.parse(content) as FunctionsJson
  }
}