import type { EntryParameters } from '@l2beat/discovery'
import type { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'

/** The template inputs needed to resolve the respected dispute game. */
export interface OpStackGameContext {
  discovery: ProjectDiscovery
  /** Overrides the discovered OptimismPortal / OptimismPortal2 entry. */
  portal?: EntryParameters
}

export function getOpStackBondScalingFactor(gameMaxDepth: number): number {
  return (
    (HARDCODED.OPTIMISM.FAULT_PROOF_HIGH_GAS_CHARGED /
      HARDCODED.OPTIMISM.FAULT_PROOF_BASE_GAS_CHARGED) **
    (1 / gameMaxDepth)
  )
}

/** Total ETH bonded along a full-depth path: one bond per depth from 0 through gameMaxDepth. */
export function getOpStackFullDisputeGameBondCostEther(
  initialBondWei: number,
  gameMaxDepth: number,
): number {
  const factor = getOpStackBondScalingFactor(gameMaxDepth)
  const initialBondEther = Number(initialBondWei) / 1e18
  return (initialBondEther * (factor ** (gameMaxDepth + 1) - 1)) / (factor - 1)
}

/**
 * Maximum time added by clock extensions along a full-depth dispute-game path.
 *
 * FaultDisputeGame applies one extension to every claim from depth 1 through
 * MAX_GAME_DEPTH - 1. The split-boundary claim gets one extra clock extension,
 * while the final preimage-boundary claim also gets the oracle challenge
 * period.
 */
export function getOpStackMaxCumulativeClockExtension(
  gameMaxDepth: number,
  gameClockExtension: number,
  oracleChallengePeriod: number,
): number {
  return gameClockExtension * gameMaxDepth + oracleChallengePeriod
}

export type FraudProofType =
  | 'None'
  | 'Permissioned'
  | 'Permissionless'
  | 'Kailua'
  | 'KailuaSoon'
  | 'OpSuccinct'
  | 'OpSuccinctFDP'
  | 'AggregateProof'

export function getFraudProofType(
  templateVars: OpStackGameContext,
): FraudProofType {
  const portal = getOptimismPortal(templateVars)

  // Legacy OptimismPortal doesn't have dispute games
  if (portal.name === 'OptimismPortal') {
    if (templateVars.discovery.hasContract('OPSuccinctL2OutputOracle')) {
      return 'OpSuccinct'
    }
    return 'None'
  }

  // OptimismPortal2 uses dispute games - check respectedGameType
  const respectedGameType = templateVars.discovery.getContractValue<number>(
    portal.name ?? portal.address,
    'respectedGameType',
  )

  if (respectedGameType === 0) {
    return 'Permissionless'
  }
  // 8 = CANNON_KONA (Karst): permissionless fault proof, same trust model as
  // type 0 (kona-client Rust program instead of op-program).
  if (respectedGameType === 8) {
    return 'Permissionless'
  }
  if (respectedGameType === 1) {
    return 'Permissioned'
  }
  if (respectedGameType === 6) {
    return 'OpSuccinct'
  }
  if (respectedGameType === 1337) {
    return 'Kailua'
  }
  if (respectedGameType === 2000) {
    return 'KailuaSoon'
  }
  if (respectedGameType === 42) {
    return 'OpSuccinctFDP'
  }
  if (respectedGameType === 621) {
    return 'AggregateProof'
  }
  throw new Error(`Unexpected respectedGameType = ${respectedGameType}`)
}

// The active permissionless game's init bond. Pre-Karst it is initBonds[0] (game
// type 0). After Karst the respected game is CANNON_KONA (type 8) and initBonds[0]
// is zeroed, so the bond lives in the per-type initBondGame8 field.
export function getPermissionlessGameBond(
  templateVars: OpStackGameContext,
): number {
  const portal = getOptimismPortal(templateVars)
  const respectedGameType =
    templateVars.discovery.getContractValueOrUndefined<number>(
      portal.name ?? portal.address,
      'respectedGameType',
    )
  if (respectedGameType === 8) {
    return templateVars.discovery.getContractValue<number>(
      'DisputeGameFactory',
      'initBondGame8',
    )
  }
  return templateVars.discovery.getContractValue<number[]>(
    'DisputeGameFactory',
    'initBonds',
  )[0]
}

// The permissioned game's init bond. v7 DisputeGameFactory_v2 exposes it per-type
// as initBondGame1; older factories expose the legacy initBonds array.
export function getPermissionedGameBond(
  templateVars: OpStackGameContext,
): number {
  const perType = templateVars.discovery.getContractValueOrUndefined<number>(
    'DisputeGameFactory',
    'initBondGame1',
  )
  if (perType !== undefined) return perType
  return templateVars.discovery.getContractValue<number[]>(
    'DisputeGameFactory',
    'initBonds',
  )[1]
}

export function getOptimismPortal(
  templateVars: OpStackGameContext,
): EntryParameters {
  if (templateVars.portal !== undefined) {
    return templateVars.portal
  }

  try {
    return templateVars.discovery.getContract('OptimismPortal')
  } catch {
    return templateVars.discovery.getContract('OptimismPortal2')
  }
}

// V2 dispute games renamed FaultDisputeGame → FaultDisputeGameV2
export function getFaultDisputeGameName(
  templateVars: OpStackGameContext,
): string {
  if (templateVars.discovery.hasContract('FaultDisputeGame')) {
    return 'FaultDisputeGame'
  }
  return 'FaultDisputeGameV2'
}

// V2 dispute games don't discover PreimageOracle (VM address is zero
// in the implementation). The standard challenge period is 86400s.
export function getOracleChallengePeriod(
  templateVars: OpStackGameContext,
): number {
  if (templateVars.discovery.hasContract('PreimageOracle')) {
    return templateVars.discovery.getContractValue<number>(
      'PreimageOracle',
      'challengePeriod',
    )
  }
  // V2: PreimageOracle not discovered (VM is zero in implementation).
  // Read from AnchorStateRegistry's chained handler instead.
  if (templateVars.discovery.hasContract('AnchorStateRegistry')) {
    const fromAnchor =
      templateVars.discovery.getContractValueOrUndefined<number>(
        'AnchorStateRegistry',
        'challengePeriodFromOracle',
      )
    if (typeof fromAnchor === 'number') return fromAnchor
  }
  return 86400
}
