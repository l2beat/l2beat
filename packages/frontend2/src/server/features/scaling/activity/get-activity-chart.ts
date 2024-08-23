import { db } from '~/server/database'
import {
  type DailyTransactionCount,
  type DailyTransactionCountProjectsMap,
} from './types'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { postprocessCounts } from './utils/postprocess-counts'
import { getActivityProjects } from './get-activity-projects'

export async function getActivityCharts() {
  // const projects = getActivityProjects()
  // const dbCounts = await getPostprocessedDailyCounts()
  // const projectCounts: DailyTransactionCountProjectsMap = new Map()
  // let ethereumCounts: DailyTransactionCount[] | undefined
  // for (const [projectId, counts] of dbCounts) {
  //   if (projectId === ProjectId.ETHEREUM) {
  //     ethereumCounts = counts
  //     continue
  //   }
  //   if (!projects.map((p) => p.id).includes(projectId)) {
  //     continue
  //   }
  //   projectCounts.set(projectId, counts)
  // }
  // return
}
