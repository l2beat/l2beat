import type { UpcomingProjectUpdate } from '~/content/monthly-updates'
import { getImageParams } from '~/utils/project/getImageParams'

export interface UpcomingProjectUpdateEntry
  extends Omit<UpcomingProjectUpdate, 'projectId'> {
  id: string
  bannerImg?: string
}

export function getUpcomingProjectUpdateEntries(
  upcomingProjectUpdateEntries: UpcomingProjectUpdate[],
): UpcomingProjectUpdateEntry[] {
  return upcomingProjectUpdateEntries.map((upcomingEntry) => {
    return getUpcomingMonthlyUpdateEntry(upcomingEntry)
  })
}

function getUpcomingMonthlyUpdateEntry(
  upcomingUpdateEntry: UpcomingProjectUpdate,
): UpcomingProjectUpdateEntry {
  const bannerImg = getImageParams(
    `/images/monthly-updates/${upcomingUpdateEntry.projectId}.png`,
  )?.src

  return {
    ...upcomingUpdateEntry,
    id: upcomingUpdateEntry.projectId,
    bannerImg,
  }
}
