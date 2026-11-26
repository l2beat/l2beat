import { assert, type json, UnixTime } from '@l2beat/shared-pure'
import { assertWatchValueNotPending } from './pendingItems'
import { hashWatchConfig, type WatchConfig, type Watched } from './WatchReader'
import type { WatchContext } from './WatchTemplate'
import { sortDeep, visitObjects } from './watchedValue'

// A watch is one unit: if any template throws, the whole run rejects, so a
// caller never stores or diffs a run that is missing a key.
export async function runWatch(
  config: WatchConfig,
  context: WatchContext,
): Promise<Watched> {
  const timestamp = UnixTime.now()
  // Public watches always run anonymously (never with private credentials such
  // as GITHUB_TOKEN) so a newly-private repository can never be published.
  const templateContext: WatchContext = config.isPublic
    ? {
        http: context.http,
        publicOnly: true,
        ...(context.signal !== undefined ? { signal: context.signal } : {}),
      }
    : context
  const values: Record<string, json> = {}
  for (const watch of config.watches) {
    if (context.signal?.aborted) {
      throw context.signal.reason
    }
    let value: json
    try {
      value = await watch.template.fetch(watch.params, templateContext)
    } catch (error) {
      if (context.signal?.aborted) {
        throw context.signal.reason
      }
      throw new Error('Watch run failed', {
        cause: { name: config.name, key: watch.key, error },
      })
    }
    if (context.signal?.aborted) {
      throw context.signal.reason
    }
    assertWatchValueNotPending(watch.key, value)
    const sorted = sortDeep(value)
    // Reject pending items inside arrays up front before the snapshot can be saved.
    visitObjects(sorted, () => {})
    // Assigning it would set the prototype of values instead of a key.
    assert(watch.key !== '__proto__', 'Watch key named __proto__')
    values[watch.key] = sorted
  }
  return { timestamp, configHash: hashWatchConfig(config), values }
}
