import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type WriteFunctionPermissionDefinition = v.infer<typeof WriteFunctionPermissionDefinition>
export const WriteFunctionPermissionDefinition = v.strictObject({
  type: v.literal('writeFunctionPermission'),
  ignoreRelative: v.boolean().optional(),
  limits: v.object({
    maxWriteFunctions: v.number().optional(),
    maxSourceSize: v.number().optional(),
    maxSourceFiles: v.number().optional(),
  }).optional(),
})

export class WriteFunctionPermissionHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly writeFunctions: string[] = []

  constructor(
    readonly field: string,
    readonly definition: WriteFunctionPermissionDefinition,
    abi: string[],
  ) {
    // Extract write functions from ABI (non-view, non-pure functions)
    this.writeFunctions = this.extractWriteFunctions(abi)
  }

  private extractWriteFunctions(abi: string[]): string[] {
    const writeFunctions: string[] = []

    for (const entry of abi) {
      if (entry.startsWith('function ')) {
        try {
          const iface = new utils.Interface([entry])
          const fragment = iface.fragments[0]

          if (fragment && fragment.type === 'function') {
            // Cast to FunctionFragment to access stateMutability
            const funcFragment = fragment as utils.FunctionFragment
            // Only include state-changing functions (exclude view/pure)
            if (funcFragment.stateMutability !== 'view' && funcFragment.stateMutability !== 'pure') {
              writeFunctions.push(funcFragment.name)
            }
          }
        } catch (error) {
          // Skip malformed ABI entries
          continue
        }
      }
    }

    return writeFunctions
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    const startTime = Date.now()
    console.log(`[WriteFunctionPermissionHandler] Starting analysis for ${address} with ${this.writeFunctions.length} write functions`)

    try {
      // Skip if no write functions found in ABI
      if (this.writeFunctions.length === 0) {
        console.log(`[WriteFunctionPermissionHandler] Skipping ${address} - no write functions`)
        return {
          field: this.field,
          value: [],
          ignoreRelative: this.definition.ignoreRelative,
        }
      }

      // Use configurable limits to prevent timeouts
      const maxWriteFunctions = this.definition.limits?.maxWriteFunctions ?? 20
      if (this.writeFunctions.length > maxWriteFunctions) {
        console.log(`[WriteFunctionPermissionHandler] Skipping ${address} - too many write functions (${this.writeFunctions.length})`)
        return {
          field: this.field,
          value: [{ skipped: true, reason: 'tooManyWriteFunctions', count: this.writeFunctions.length }],
          ignoreRelative: this.definition.ignoreRelative,
        }
      }

      // Get source code with timeout protection
      const contractSource = await provider.getSource(address)
      console.log(`[WriteFunctionPermissionHandler] Source fetch completed for ${address} - verified: ${contractSource.isVerified}, files: ${Object.keys(contractSource.files).length}`)

      if (!contractSource.isVerified || Object.keys(contractSource.files).length === 0) {
        console.log(`[WriteFunctionPermissionHandler] Skipping ${address} - source not verified or no files`)
        return {
          field: this.field,
          value: [],
          ignoreRelative: this.definition.ignoreRelative,
        }
      }

      // Use configurable size limits
      const totalSourceSize = Object.values(contractSource.files).reduce((sum, content) => sum + content.length, 0)
      console.log(`[WriteFunctionPermissionHandler] Source size for ${address}: ${totalSourceSize} bytes`)

      const maxSourceSize = this.definition.limits?.maxSourceSize ?? 100000
      if (totalSourceSize > maxSourceSize) {
        console.log(`[WriteFunctionPermissionHandler] Skipping ${address} - source too large (${totalSourceSize} bytes)`)
        return {
          field: this.field,
          value: [{ skipped: true, reason: 'sourceCodeTooLarge', sizeBytes: totalSourceSize }],
          ignoreRelative: this.definition.ignoreRelative,
        }
      }

      // Skip contracts with too many source files
      const maxSourceFiles = this.definition.limits?.maxSourceFiles ?? 5
      if (Object.keys(contractSource.files).length > maxSourceFiles) {
        console.log(`[WriteFunctionPermissionHandler] Skipping ${address} - too many source files (${Object.keys(contractSource.files).length})`)
        return {
          field: this.field,
          value: [{ skipped: true, reason: 'tooManySourceFiles', fileCount: Object.keys(contractSource.files).length }],
          ignoreRelative: this.definition.ignoreRelative,
        }
      }

      // Analyze only the write functions identified from ABI
      console.log(`[WriteFunctionPermissionHandler] Starting source analysis for ${address}`)
      const permissions = this.analyzeWriteFunctionPermissions(contractSource.files)

      const duration = Date.now() - startTime
      console.log(`[WriteFunctionPermissionHandler] Completed ${address} in ${duration}ms, found ${permissions.length} permissions`)

      return {
        field: this.field,
        value: permissions.length > 0 ? permissions : [],
        ignoreRelative: this.definition.ignoreRelative,
      }
    } catch (error) {
      const duration = Date.now() - startTime
      console.log(`[WriteFunctionPermissionHandler] ERROR on ${address} after ${duration}ms:`, error instanceof Error ? error.message : 'Unknown error')
      return {
        field: this.field,
        value: [{ error: true, message: error instanceof Error ? error.message : 'Unknown error' }],
        ignoreRelative: this.definition.ignoreRelative,
      }
    }
  }

  private analyzeWriteFunctionPermissions(files: Record<string, string>): ContractValue[] {
    const permissions: ContractValue[] = []

    // Simplified permission modifiers - focus on most common ones only
    const permissionModifiers = [
      'onlyOwner',
      'onlyGovernor',
      'onlyAdmin',
      'onlyController',
      'whenNotPaused',
      'nonReentrant',
    ]

    // For each write function identified in ABI, search for it in source code
    for (const functionName of this.writeFunctions) {
      for (const [filename, content] of Object.entries(files)) {
        // Skip very large files that might cause timeout
        if (content.length > 50000) continue // 50KB per file limit (was 200KB)

        // Use simple string search instead of complex regex
        const functionPattern = `function ${functionName}(`
        const functionIndex = content.indexOf(functionPattern)

        if (functionIndex === -1) continue

        // Extract a smaller section around the function
        const startIndex = Math.max(0, functionIndex - 100)
        const endIndex = Math.min(content.length, functionIndex + 2000) // Reduced from 5000
        const functionSection = content.slice(startIndex, endIndex)

        // Find the function signature using simple string search
        const signatureEnd = functionSection.indexOf(')', functionIndex - startIndex)
        if (signatureEnd === -1) continue

        const signature = functionSection.slice(functionIndex - startIndex, signatureEnd + 1)

        const permission: Record<string, ContractValue> = {
          function: functionName,
          signature: signature,
          file: filename,
          permissionType: 'none',
          category: this.categorizeDeFiFunction(functionName),
        }

        // Check for permission modifiers using simple string search (no regex)
        const modifiers: string[] = []
        for (const modifier of permissionModifiers) {
          if (functionSection.includes(modifier)) {
            modifiers.push(modifier)
          }
        }

        if (modifiers.length > 0) {
          permission.permissionType = 'modifier'
          permission.modifiers = modifiers
        }

        // Check for msg.sender using simple string search
        if (functionSection.includes('msg.sender')) {
          if (permission.permissionType === 'none') {
            permission.permissionType = 'msgSender'
          }
          permission.hasMsgSenderCheck = true
        }

        // Check for require statements using simple string search
        const requireCount = (functionSection.match(/require\(/g) || []).length
        if (requireCount > 0) {
          permission.requireStatementCount = requireCount
        }

        // Include ALL write functions - helps identify unprotected functions
        permissions.push(permission)
        break // Only analyze the first occurrence of each function
      }
    }

    return permissions
  }

  private categorizeDeFiFunction(functionName: string): string {
    const lowerName = functionName.toLowerCase()

    // Financial functions - directly move funds
    if (/^(withdraw|transfer|send|pay|deposit|mint|burn|skim|sweep|rescue|recover)/.test(lowerName)) {
      return 'financial'
    }

    // Administrative functions - change system parameters
    if (/^(set|update|change|configure|admin|owner|governance)/.test(lowerName)) {
      return 'administrative'
    }

    // Emergency functions - can halt or pause system
    if (/^(pause|unpause|freeze|unfreeze|emergency|stop|start)/.test(lowerName)) {
      return 'emergency'
    }

    // Liquidation functions - DeFi-specific
    if (/^(liquidat|seize|borrow|repay|flash)/.test(lowerName)) {
      return 'liquidation'
    }

    return 'other'
  }
}