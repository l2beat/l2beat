import { getEnv } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { createDatabase } from '@l2beat/database'
import {
  assert,
  ProjectId,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  boolean,
  command,
  extendType,
  flag,
  option,
  optional,
  run,
  string,
} from 'cmd-ts'
import { formatDuration } from '../../src/modules/shared/notifiers/utils/format'

const ps = new ProjectService()

export const AnomalyKey = extendType(string, {
  async from(input) {
    const match = input.match(
      /^([a-z0-9-]+)-(stateUpdates|batchSubmissions|proofSubmissions)$/i,
    )
    assert(match, 'Provide anomaly key in following form <projectId>-<subtype>')

    const projectId = match[1]
    const subtype = match[2] as TrackedTxsConfigSubtype

    const project = await ps.getProject({
      id: ProjectId(projectId),
    })

    assert(project, `Project with id ${projectId} not found`)

    return {
      projectId,
      subtype,
    }
  },
})

const args = {
  list: flag({
    type: boolean,
    long: 'list',
    short: 'ls',
    description: 'List ongoing anomalies',
  }),
  approve: option({
    type: optional(AnomalyKey),
    long: 'approve',
    short: 'appr',
    description: 'Approve ongoing anomaly to be shown on website widget',
  }),
  remove: option({
    type: optional(AnomalyKey),
    long: 'remove',
    short: 'r',
    description:
      'Remove approval of ongoing anomaly to be hidden from website widget',
  }),
}

const cmd = command({
  name: 'execute',
  args,
  handler: async (args) => {
    const env = getEnv()

    const dbUrl = env.optionalString('PROD_WRITE_DB_URL')

    if (!dbUrl) {
      console.error(
        'PROD_WRITE_DB_URL is not set. All data will be fetched from APIs',
      )
      process.exit(1)
    }

    const db = createDatabase({
      connectionString: dbUrl,
      application_name: 'ANOMALY-CLI-TOOL',
      ssl: { rejectUnauthorized: false },
      min: 2,
      max: 10,
      keepAlive: false,
    })

    if (args.list) {
      console.log('Fetching ongoing anomalies...')
      const ongoingAnomalies = await db.realTimeAnomalies.getOngoingAnomalies()

      if (ongoingAnomalies.length === 0) {
        console.log('No ongoing anomalies found.')
        process.exit(0)
      }
      const now = UnixTime.now()
      const rows = ongoingAnomalies
        .map((anomaly) => ({
          duration: now - anomaly.start,
          ...anomaly,
        }))
        .sort((a, b) => {
          return b.duration - a.duration
        })
        .map((anomaly) => ({
          ...anomaly,
          duration: formatDuration(anomaly.duration),
          start: new Date(anomaly.start * 1000).toISOString(),
        }))

      console.table(rows, [
        'duration',
        'projectId',
        'subtype',
        'start',
        'isApproved',
      ])
    } else if (args.approve) {
      const ongoingAnomalies = await db.realTimeAnomalies.getOngoingAnomalies()
      const toApprove = ongoingAnomalies.find(
        (anomaly) =>
          anomaly.projectId === args.approve?.projectId &&
          anomaly.subtype === args.approve?.subtype,
      )

      if (!toApprove || toApprove.status !== 'ongoing') {
        console.error(
          `No ongoing anomaly found for project ${args.approve.projectId} and subtype ${args.approve.subtype}.`,
        )
        process.exit(1)
      }

      console.log(
        `Approving anomaly for project ${toApprove.projectId} and subtype ${toApprove.subtype}...`,
      )
      toApprove.isApproved = true

      await db.realTimeAnomalies.upsertMany([toApprove])
      console.log('Done')
    } else if (args.remove) {
      const ongoingAnomalies = await db.realTimeAnomalies.getOngoingAnomalies()
      const toRemove = ongoingAnomalies.find(
        (anomaly) =>
          anomaly.projectId === args.remove?.projectId &&
          anomaly.subtype === args.remove?.subtype,
      )

      if (!toRemove || !toRemove.isApproved) {
        console.error(
          `No approved anomaly found for project ${args.remove.projectId} and subtype ${args.remove.subtype}.`,
        )
        process.exit(1)
      }

      console.log(
        `Removing approval of anomaly for project ${toRemove.projectId} and subtype ${toRemove.subtype}...`,
      )
      toRemove.isApproved = false

      await db.realTimeAnomalies.upsertMany([toRemove])
      console.log('Done')
    } else {
      console.log(
        'No action specified. Use --list to list ongoing anomalies or --approve to approve an anomaly.',
      )
    }

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))
