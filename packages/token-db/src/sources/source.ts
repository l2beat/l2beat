import { Logger } from '@l2beat/backend-tools'
import type { Promisable } from 'type-fest'
import { PrismaClient } from '../db/prisma.js'

export interface SourceContext {
  logger: Logger
  db: PrismaClient
}
export type Source<Args = never> = (
  context: { args: Args } & SourceContext,
) => Promisable<void>
