import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { createHash } from 'crypto'

/**
 * The protocol's addresses make the id; keys are sorted, so reordering them in
 * a project file keeps the id and the indexed history. The quoted pools don't:
 * past hours were quoted where the liquidity was, so a pool change applies from
 * then on instead of wiping and re-reading the project.
 */
export function getLiquidStakingConfigurationId(
  projectId: ProjectId,
  contracts: ProjectLiquidStakingContracts,
): string {
  const { marketQuotes: _, ...addresses } = contracts
  const identity = {
    projectId,
    contracts: Object.fromEntries(
      Object.entries(addresses).sort(([a], [b]) => a.localeCompare(b)),
    ),
  }
  return createHash('sha1')
    .update(JSON.stringify(identity))
    .digest('hex')
    .slice(0, 12)
}
