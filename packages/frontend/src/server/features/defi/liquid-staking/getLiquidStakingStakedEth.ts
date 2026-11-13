import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import type {
  LiquidStakingSnapshotRecord,
  TokenValueRecord,
} from '@l2beat/database'
import { assertUnreachable, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'

export interface StakedEthProject {
  id: string
  type: ProjectLiquidStakingContracts['type']
  /** The project's TVS tokens. */
  tokenIds: string[]
}

/**
 * The ETH each protocol's tokens stand for at a day start, by project id: the
 * supply TVS reads, times the ETH per token. It is read at the same moment as
 * the network's ETH staked, so the two can be divided.
 */
export async function getLiquidStakingStakedEth(
  projectIds: string[],
  day: UnixTime,
): Promise<Map<string, number>> {
  const projects = (
    await ps.getProjects({
      ids: projectIds.map(ProjectId),
      select: ['liquidStaking'],
      optional: ['tvsConfig'],
    })
  ).map(
    (project): StakedEthProject => ({
      id: project.id,
      type: project.liquidStaking.contracts.type,
      tokenIds: (project.tvsConfig ?? []).map((token) => token.id),
    }),
  )

  if (env.MOCK) {
    return new Map(
      projects.map((project, i) => [
        project.id,
        // Shares that shrink down the list, like the real ones.
        (10_000_000 / (i + 1) ** 1.5) * (0.9 + Math.random() * 0.2),
      ]),
    )
  }

  const db = getDb()
  const [tokenValues, snapshots] = await Promise.all([
    db.tvsTokenValue.getAtOrBefore(
      projects.flatMap((project) =>
        project.tokenIds.map((tokenId) => ({
          projectId: project.id,
          tokenId,
          timestamp: day,
        })),
      ),
    ),
    db.liquidStakingSnapshot.getDayStartsByProjectsInRange(
      projects.map((project) => project.id),
      day,
      day,
    ),
  ])
  return computeStakedEth({ projects, day, tokenValues, snapshots })
}

/** A supply older than this leaves the project without a value. */
const MAX_SUPPLY_AGE = UnixTime.DAY

export function computeStakedEth(inputs: {
  projects: StakedEthProject[]
  day: UnixTime
  tokenValues: TokenValueRecord[]
  snapshots: LiquidStakingSnapshotRecord[]
}): Map<string, number> {
  const result = new Map<string, number>()
  for (const project of inputs.projects) {
    const rate = inputs.snapshots.find(
      (s) => s.projectId === project.id && s.timestamp === inputs.day,
    )?.exchangeRate
    const ethPerToken = getEthPerToken(project.type, rate)
    if (ethPerToken === undefined) continue

    const values = project.tokenIds.map((tokenId) =>
      inputs.tokenValues.find(
        (v) =>
          v.projectId === project.id &&
          v.tokenId === tokenId &&
          v.timestamp >= inputs.day - MAX_SUPPLY_AGE,
      ),
    )
    // A missing token would understate the share, so it shows as no data.
    if (values.length === 0 || values.some((v) => v === undefined)) continue

    const supply = values.reduce((sum, v) => sum + (v?.amount ?? 0), 0)
    result.set(project.id, supply * ethPerToken)
  }
  return result
}

/** ETH per token TVS tracks for the protocol. */
function getEthPerToken(
  type: ProjectLiquidStakingContracts['type'],
  exchangeRate: bigint | undefined,
): number | undefined {
  switch (type) {
    // TVS tracks the rebasing stETH and eETH, one ETH each. The indexer's rate
    // is that of their wrappers, wstETH and weETH, so it does not apply.
    case 'lido':
    case 'etherfi':
      return 1
    // TVS tracks the token whose rate the indexer reads.
    case 'rocketpool':
    case 'wbeth':
    case 'cbeth':
      return exchangeRate === undefined
        ? undefined
        : Number(exchangeRate / 10n ** 9n) / 1e9
    default:
      assertUnreachable(type)
  }
}
