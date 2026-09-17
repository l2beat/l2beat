import { dirname } from 'node:path'
import { postgresHarness } from '@l2beat/database/src/test/postgresHarness'

/**
 * The Postgres backend's suites run against. It is the same server and the
 * same `TEST_DB_URL` the database package uses, so the prefix keeps the two
 * packages' schemas apart, and the migrations that create them live in
 * `@l2beat/database` rather than here.
 */
export const testDatabase = postgresHarness({
  schemaPrefix: 'backend_test',
  prismaDir: dirname(require.resolve('@l2beat/database/package.json')),
})
