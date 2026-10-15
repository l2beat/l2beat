import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'

interface ProjectDataCheckConfig {
  /** Names the cache in logs */
  name: string
  /** Every key a page may ask about */
  getCandidates: () => Promise<string[]>
  /** The subset of `keys` with data at or after `fromInclusive` */
  getKeysWithData: (
    keys: string[],
    fromInclusive: UnixTime | undefined,
  ) => Promise<string[]>
}

/**
 * Project pages each ask whether their project has data for a section. They
 * render in bursts (crawlers, page cache refills), where one query per page
 * can drain the database pool. So the check asks for every candidate at once
 * and pages share the answer.
 *
 * `fromInclusive` is part of the cache key, so pass a value that changes
 * rarely, like the day-aligned start of `optionToRange`.
 */
export function createProjectDataCheck(config: ProjectDataCheckConfig) {
  const cache = new FrontendInMemoryCache(config.name)

  return async function hasData(
    key: string,
    fromInclusive: UnixTime | undefined,
  ): Promise<boolean> {
    if (env.MOCK) {
      return true
    }

    const answer = await cache.get(
      { key: [config.name, String(fromInclusive)], ttl: 5 * 60 },
      async () => {
        const candidates = await config.getCandidates()
        const keys = await config.getKeysWithData(candidates, fromInclusive)
        return { candidates: new Set(candidates), keys: new Set(keys) }
      },
    )
    if (answer.candidates.has(key)) {
      return answer.keys.has(key)
    }
    // Not a candidate, so not in the shared answer.
    const keys = await config.getKeysWithData([key], fromInclusive)
    return keys.length > 0
  }
}
