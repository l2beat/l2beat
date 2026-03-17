import type { DiscoveredDataAccess } from './ownerResolution'
import type { DetectedTimelockDelay, OwnershipChainStep } from './types'

/** Delay field names to check, in priority order */
const DELAY_FIELD_NAMES = ['delay', 'getMinDelay', 'minDelay', 'MINIMUM_DELAY']

/**
 * Checks whether a chain step looks like a timelock contract.
 * Matches OZ TimelockController (contractType === 'Timelock')
 * and Compound-style timelocks (name contains "timelock").
 */
function isTimelockStep(step: OwnershipChainStep): boolean {
  if (step.contractType === 'Timelock') return true
  if (step.contractName.toLowerCase().includes('timelock')) return true
  return false
}

/**
 * Scan an ownership chain for a timelock contract and extract its delay value.
 * Returns the first valid detection (closest timelock to the target function),
 * or null if no timelock is found in the chain.
 */
export function detectTimelockInChain(
  chain: OwnershipChainStep[],
  dataAccess: DiscoveredDataAccess,
): DetectedTimelockDelay | null {
  for (const step of chain) {
    if (!isTimelockStep(step)) continue

    try {
      const contract = dataAccess.findContract(step.contractAddress)
      const values = dataAccess.getValuesObject(contract)

      for (const fieldName of DELAY_FIELD_NAMES) {
        const raw = values[fieldName]
        if (raw === undefined) continue

        const seconds = typeof raw === 'number' ? raw : Number(raw)
        if (isNaN(seconds)) continue

        return {
          contractAddress: step.contractAddress,
          contractName: step.contractName,
          fieldName,
          seconds,
        }
      }
    } catch {
      // Contract not found or has no values — skip
    }
  }

  return null
}
