import { ProjectId, type UnixTime } from '@l2beat/shared-pure'

/** The row the activity services are expected to produce for one day. */
export function activityRecord(
  projectId: string,
  timestamp: UnixTime,
  count: number,
  uopsCount: number | null,
  start = 0,
  end = 10,
) {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count,
    uopsCount,
    start,
    end,
  }
}
