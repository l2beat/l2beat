import type { AuditsContractEntry, AuditsSummaryEntry } from './types'

/**
 * Deployed contracts whose whole flattened source (every unit of every
 * source, proxy included) is identical to audited code. A contract without
 * verified source or without any unit never counts, but it stays in the
 * denominator used by `fullyCoveredShare`.
 */
export function countFullyCoveredContracts(
  contracts: Pick<AuditsContractEntry, 'noSource' | 'coverage'>[],
): number {
  return contracts.filter(isFullyCovered).length
}

function isFullyCovered(
  contract: Pick<AuditsContractEntry, 'noSource' | 'coverage'>,
): boolean {
  if (contract.noSource) return false
  const { units } = contract.coverage
  const total =
    units.identical + units.library + units.differs + units.unaudited
  return total > 0 && units.differs === 0 && units.unaudited === 0
}

export function fullyCoveredShare({
  fullyCoveredContracts,
  contracts,
}: {
  fullyCoveredContracts: number
  contracts: number
}): number {
  return contracts === 0 ? 0 : fullyCoveredContracts / contracts
}

export function linesCoveredShare({
  coverage: { lines },
}: Pick<AuditsSummaryEntry, 'coverage'>): number {
  return lines.total === 0 ? 0 : lines.covered / lines.total
}
