import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type FunctionPermissionDefinition = v.infer<typeof FunctionPermissionDefinition>
export const FunctionPermissionDefinition = v.strictObject({
  type: v.literal('functionPermission'),
  ignoreRelative: v.boolean().optional(),
})

export class FunctionPermissionHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: FunctionPermissionDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    try {
      // Get source code
      const contractSource = await provider.getSource(address)

      if (!contractSource.isVerified || Object.keys(contractSource.files).length === 0) {
        return {
          field: this.field,
          value: [],
          ignoreRelative: this.definition.ignoreRelative,
        }
      }

      const permissions = this.analyzeFunctionPermissions(contractSource.files)

      return {
        field: this.field,
        value: permissions,
        ignoreRelative: this.definition.ignoreRelative,
      }
    } catch (error) {
      return {
        field: this.field,
        value: [],
        ignoreRelative: this.definition.ignoreRelative,
      }
    }
  }

  private analyzeFunctionPermissions(files: Record<string, string>): ContractValue[] {
    const permissions: ContractValue[] = []

    // Common permission modifiers in DeFi
    const permissionModifiers = [
      'onlyOwner',
      'onlyGovernor',
      'onlyGovernance',
      'onlyAdmin',
      'onlyMinter',
      'onlyBurner',
      'onlyOperator',
      'onlyController',
      'onlyGuardian',
      'onlyTimelock',
      'whenNotPaused',
      'nonReentrant'
    ]

    // Analyze all source files
    for (const [filename, sourceCode] of Object.entries(files)) {
      // Extract functions with their modifiers
      const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*(?:external|public|internal|private)?\s*(?:view|pure|payable)?\s*(?:virtual|override)?\s*([^{]*)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/gs

      let match
      while ((match = functionRegex.exec(sourceCode)) !== null) {
        const functionName = match[1]
        const modifierSection = match[2]
        const functionBody = match[3]

        // Skip constructors and fallback functions or if values are undefined
        if (!functionName || !modifierSection || !functionBody ||
            functionName === 'constructor' || functionName === 'fallback' || functionName === 'receive') {
          continue
        }

        const permission: Record<string, ContractValue> = {
          function: functionName,
          signature: this.extractFunctionSignature(match[0] ?? ''),
          file: filename,
          permissionType: 'custom',
        }

        // Check for permission modifiers
        const modifiers = this.extractModifiers(modifierSection, permissionModifiers)
        if (modifiers.length > 0) {
          permission.permissionType = 'modifier'
          permission.modifiers = modifiers
          const owner = this.resolveOwnerFromModifier(modifiers)
          if (owner) {
            permission.owner = owner
          }
        }

        // Check for msg.sender usage in function body
        const msgSenderChecks = this.extractMsgSenderChecks(functionBody)
        if (msgSenderChecks.length > 0) {
          if (permission.permissionType === 'custom') {
            permission.permissionType = 'msgSender'
          }
          permission.requireStatements = msgSenderChecks
        }

        // Check for custom permission patterns
        const customChecks = this.extractCustomPermissionChecks(functionBody)
        if (customChecks.length > 0) {
          permission.customChecks = customChecks
        }

        // Only include functions that have some form of permission control
        if ((permission.modifiers as ContractValue[])?.length ||
            (permission.requireStatements as ContractValue[])?.length ||
            (permission.customChecks as ContractValue[])?.length) {
          permissions.push(permission)
        }
      }
    }

    return permissions
  }

  private extractFunctionSignature(functionText: string): string {
    const signatureMatch = functionText.match(/function\s+\w+\s*\([^)]*\)/)
    return signatureMatch?.[0] ?? ''
  }

  private extractModifiers(modifierSection: string, permissionModifiers: string[]): string[] {
    const modifiers: string[] = []

    for (const modifier of permissionModifiers) {
      const modifierRegex = new RegExp(`\\b${modifier}\\b`, 'g')
      if (modifierRegex.test(modifierSection)) {
        modifiers.push(modifier)
      }
    }

    // Also check for role-based modifiers
    const roleModifierRegex = /\b(hasRole|onlyRole)\s*\(\s*([^)]+)\s*\)/g
    let roleMatch
    while ((roleMatch = roleModifierRegex.exec(modifierSection)) !== null) {
      if (roleMatch[1] && roleMatch[2]) {
        modifiers.push(`${roleMatch[1]}(${roleMatch[2].trim()})`)
      }
    }

    return modifiers
  }

  private extractMsgSenderChecks(functionBody: string): string[] {
    const checks: string[] = []

    // Look for require statements with msg.sender
    const requireRegex = /require\s*\(\s*([^)]*msg\.sender[^)]*)\s*(?:,\s*[^)]+)?\s*\)/g
    let match
    while ((match = requireRegex.exec(functionBody)) !== null) {
      if (match[1]) {
        checks.push(match[1].trim())
      }
    }

    // Look for if statements with msg.sender
    const ifRegex = /if\s*\(\s*([^)]*msg\.sender[^)]*)\s*\)/g
    while ((match = ifRegex.exec(functionBody)) !== null) {
      if (match[1]) {
        checks.push(`if(${match[1].trim()})`)
      }
    }

    // Look for assert statements with msg.sender
    const assertRegex = /assert\s*\(\s*([^)]*msg\.sender[^)]*)\s*\)/g
    while ((match = assertRegex.exec(functionBody)) !== null) {
      if (match[1]) {
        checks.push(`assert(${match[1].trim()})`)
      }
    }

    return checks
  }

  private extractCustomPermissionChecks(functionBody: string): string[] {
    const checks: string[] = []

    // Look for common permission patterns
    const patterns = [
      /require\s*\(\s*([^)]*(?:owner|admin|governance|timelock)[^)]*)\s*(?:,\s*[^)]+)?\s*\)/gi,
      /require\s*\(\s*([^)]*(?:authorized|approved|whitelisted)[^)]*)\s*(?:,\s*[^)]+)?\s*\)/gi,
      /require\s*\(\s*([^)]*(?:paused|frozen|stopped)[^)]*)\s*(?:,\s*[^)]+)?\s*\)/gi
    ]

    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(functionBody)) !== null) {
        if (match[1]) {
          const check = match[1].trim()
          // Avoid duplicating msg.sender checks
          if (!check.includes('msg.sender')) {
            checks.push(check)
          }
        }
      }
    }

    return checks
  }

  private resolveOwnerFromModifier(modifiers: string[]): string | undefined {
    // Simple resolution for common patterns
    // In a real implementation, this would be more sophisticated
    if (modifiers.includes('onlyOwner')) {
      return 'owner()'
    }
    if (modifiers.includes('onlyGovernor') || modifiers.includes('onlyGovernance')) {
      return 'governance'
    }
    if (modifiers.includes('onlyAdmin')) {
      return 'admin'
    }
    if (modifiers.includes('onlyTimelock')) {
      return 'timelock'
    }

    // Check for role-based access
    const roleModifier = modifiers.find(m => m.startsWith('hasRole(') || m.startsWith('onlyRole('))
    if (roleModifier) {
      return `role:${roleModifier}`
    }

    return undefined
  }
}