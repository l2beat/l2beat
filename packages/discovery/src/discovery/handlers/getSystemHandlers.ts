import { utils } from 'ethers'

import type { StructureContractConfig } from '../config/structureUtils'
import type { Handler } from './Handler'
import { LimitedArrayHandler } from './system/LimitedArrayHandler'
import { SimpleMethodHandler } from './system/SimpleMethodHandler'
import { WriteFunctionPermissionHandler } from './defidisco/WriteFunctionPermissionHandler'

export function getSystemHandlers(
  abiEntries: string[],
  config: StructureContractConfig,
): Handler[] {
  const abi = new utils.Interface(abiEntries)

  const methodHandlers: Handler[] = []
  const arrayHandlers: Handler[] = []

  for (const fn of Object.values(abi.functions)) {
    if (!fn.constant || (fn.outputs?.length ?? 0) === 0) {
      // function is neither pure nor view, or simply doesn't return anything
      continue
    }
    if (config.ignoreMethods.includes(fn.name)) {
      continue
    }
    if (fn.inputs.length === 0) {
      methodHandlers.push(new SimpleMethodHandler(fn))
    } else if (fn.inputs.length === 1 && fn.inputs[0]?.type === 'uint256') {
      arrayHandlers.push(new LimitedArrayHandler(fn, 5))
    }
  }

  // Add automatic write function permission analysis for contracts with write functions
  const permissionHandlers: Handler[] = []

  // Check if permission scanning is enabled (default: true)
  const defidiscoConfig = config.defidisco
  const scanPermissions = defidiscoConfig?.scanPermissions ?? true

  if (scanPermissions) {
    // Only create handler if there are write functions to analyze
    const hasWriteFunctions = abiEntries.some(entry => {
      if (!entry.startsWith('function ')) return false
      try {
        const iface = new utils.Interface([entry])
        const fragment = iface.fragments[0]
        if (fragment && fragment.type === 'function') {
          const funcFragment = fragment as utils.FunctionFragment
          return funcFragment.stateMutability !== 'view' && funcFragment.stateMutability !== 'pure'
        }
      } catch (error) {
        // Skip malformed entries
      }
      return false
    })

    if (hasWriteFunctions) {
      const permissionLimits = defidiscoConfig?.permissionLimits
      const writeFunctionPermissionHandler = new WriteFunctionPermissionHandler(
        'writeFunctionPermissions',
        {
          type: 'writeFunctionPermission' as const,
          limits: permissionLimits
        },
        abiEntries
      )
      permissionHandlers.push(writeFunctionPermissionHandler)
    }
  }

  return methodHandlers.concat(arrayHandlers).concat(permissionHandlers)
}
