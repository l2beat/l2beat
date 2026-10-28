import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { createHash } from 'crypto'

/**
 * Keys are sorted, so reordering them in a project file keeps the id and the
 * indexed history.
 */
export function getLiquidStakingConfigurationId(
  projectId: ProjectId,
  contracts: ProjectLiquidStakingContracts,
): string {
  const identity = {
    projectId,
    contracts: Object.fromEntries(
      Object.entries(contracts).sort(([a], [b]) => a.localeCompare(b)),
    ),
  }
  return createHash('sha1')
    .update(JSON.stringify(identity))
    .digest('hex')
    .slice(0, 12)
}
