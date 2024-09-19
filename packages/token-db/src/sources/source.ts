import { Logger } from '@l2beat/backend-tools'
import type { Promisable } from 'type-fest'
import { Database } from '@l2beat/database'

export interface SourceContext {
  logger: Logger
  db: Database
}
export type Source<Args = never> = (
  context: { args: Args } & SourceContext,
) => Promisable<void>
