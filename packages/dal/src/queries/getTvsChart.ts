import type { ProjectId } from '@l2beat/shared-pure'
import { getCache, getDb, getLogger } from '../utils'
import { type BreakdownItem, getTvsChartQuery } from './getTvsChartQuery'

export async function getTvsChart(
  projects: ProjectId[],
): Promise<BreakdownItem[]> {
  const cache = getCache()
  const logger = getLogger()

  // TODO: implement calculating a hash of the query method code
  const key = cache.generateKey('getTvsChartQuery', projects.sort())

  logger.info(`Checking cache (key: ${key})`)

  let start = Date.now()

  const cached = await cache.read<BreakdownItem[]>(key)
  if (cached) {
    const end = Date.now()
    logger.info(`Cache hit! Took ${end - start}ms`)

    const size = Buffer.byteLength(JSON.stringify(cached), 'utf8')
    logger.info(`Data size: ${size / 1024} KB`)
    return cached
  }

  logger.info('Cache miss, querying DB...')

  const db = getDb()
  const tvsChartData = await getTvsChartQuery(db, projects)

  let end = Date.now()
  logger.info(`Getting data from DB took ${end - start}ms`)

  start = Date.now()

  await cache.write(key, JSON.stringify(tvsChartData), 3600)

  end = Date.now()
  logger.info(`Writing to cache took ${end - start}ms`)

  return tvsChartData
}
