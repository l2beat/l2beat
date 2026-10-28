import { type json, UnixTime } from '@l2beat/shared-pure'
import type { WatchConfig, Watched } from './WatchReader'
import type { WatchContext } from './WatchTemplate'
import { sortDeep } from './watchedValue'

// A watch is one unit: if any template throws, the whole run rejects, so a
// caller never stores or diffs a run that is missing a key.
export async function runWatch(
  config: WatchConfig,
  context: WatchContext,
): Promise<Watched> {
  const timestamp = UnixTime.now()
  const values: Record<string, json> = {}
  for (const watch of config.watches) {
    let value: json
    try {
      value = await watch.template.fetch(watch.params, context)
    } catch (error) {
      throw new Error('Watch run failed', {
        cause: { name: config.name, key: watch.key, error },
      })
    }
    values[watch.key] = sortDeep(value)
  }
  return { timestamp, values }
}
