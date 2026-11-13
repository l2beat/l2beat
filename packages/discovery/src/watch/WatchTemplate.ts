import type { HttpClient } from '@l2beat/shared'
import type { json } from '@l2beat/shared-pure'
import type { Validator, v } from '@l2beat/validate'

export interface WatchContext {
  http: HttpClient
  githubToken?: string
}

// `fetch` must throw on any failure instead of returning partial data: a
// value missing a key would diff as a removal and be accepted later.
export interface WatchTemplate<
  P extends Validator<unknown> = Validator<unknown>,
> {
  name: string
  params: P
  fetch(params: v.infer<P>, context: WatchContext): Promise<json>
}
