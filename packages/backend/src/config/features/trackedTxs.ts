import type { Env } from '@l2beat/backend-tools'
import type { ProjectService } from '@l2beat/config'
import { createTrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { TrackedTxsConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export async function getTrackedTxsConfig(
  ps: ProjectService,
  env: Env,
  flags: FeatureFlags,
): Promise<TrackedTxsConfig> {
  const projects = await ps.getProjects({
    select: ['trackedTxsConfig'],
    optional: ['archivedAt'],
  })

  return {
    projects: projects.map((p) => ({
      id: p.id,
      isArchived: p.archivedAt !== undefined,
      configurations: p.trackedTxsConfig.map((c) => ({
        ...c,
        id: createTrackedTxId(c),
      })),
    })),
    bigQuery: {
      clientEmail: env.string('BIGQUERY_CLIENT_EMAIL'),
      privateKey: env.string('BIGQUERY_PRIVATE_KEY').replace(/\\n/g, '\n'),
      projectId: env.string('BIGQUERY_PROJECT_ID'),
    },
    // TODO: figure out how to set it for local development
    minTimestamp: UnixTime.fromDate(new Date('2023-05-01T00:00:00Z')),
    uses: {
      liveness: flags.isEnabled('tracked-txs', 'liveness'),
      l2costs: flags.isEnabled('tracked-txs', 'l2costs') && {
        aggregatorEnabled: flags.isEnabled(
          'tracked-txs',
          'l2costs',
          'aggregator',
        ),
      },
    },
  }
}
