declare module 'knex/lib/migrations/migrate/sources/fs-migrations' {
  import { Knex } from 'knex'
  export class FsMigrations {
    constructor(
      migrationsDirectory: string,
      sortDirsSeparately: boolean,
      loadExtensions: string[],
    )

    getMigrations(loadExtensions: string[]): Promise<unknown[]>
    getMigration(migration: unknown): Promise<Knex.Migration>
  }
}
