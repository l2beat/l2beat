// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>
import { UnixTime } from '@l2beat/shared-pure'
import { getActivityProjectsData } from '../../utils/get-activity-data'

const cache = new Map<
  string,
  Awaited<ReturnType<typeof getActivityProjectsData>>
>()

const data = async () => {
  const key = UnixTime.now().toStartOf('hour').toString()

  if (cache.has(key)) {
    return cache.get(key)
  } else {
    const activityData = await getActivityProjectsData()
    cache.set(key, activityData)
    return activityData
  }
}
