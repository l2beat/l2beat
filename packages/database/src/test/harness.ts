import { postgresHarness } from './postgresHarness'

/**
 * The Postgres the database suites run against. `database_test` keeps this
 * package's schemas apart from the ones `backend` creates for its own suites,
 * which may be pointed at the very same server by the same `TEST_DB_URL`.
 */
export const testDatabase = postgresHarness({ schemaPrefix: 'database_test' })
