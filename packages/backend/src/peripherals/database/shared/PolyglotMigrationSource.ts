import { readdirSync } from 'fs'
// See https://github.com/knex/knex/issues/2756
import { FsMigrations } from 'knex/lib/migrations/migrate/sources/fs-migrations'
import type { Knex } from 'knex/types'
import path from 'path'

/* Based on https://github.com/knex/knex/issues/4028#issuecomment-689683353 */
export class PolyglotMigrationSource
  extends FsMigrations
  implements Knex.MigrationSource<unknown>
{
  fsSource: FsMigrations

  constructor(
    migrationsDirectory: string,
    sortDirsSeparately = false,
    private readonly loadExtensions = ['.js', '.ts'],
  ) {
    const migrationsDirContents = readdirSync(migrationsDirectory)
    // If there is a built .js file in migrations directory,
    // and a source file in compile-to-js language, we use only the .js file.
    const isBuilt = migrationsDirContents.find((file) => file.endsWith('.js'))
    if (isBuilt) {
      loadExtensions = ['.js']
    }

    super(migrationsDirectory, sortDirsSeparately, loadExtensions)
    this.loadExtensions = loadExtensions

    this.fsSource = new FsMigrations(
      migrationsDirectory,
      sortDirsSeparately,
      loadExtensions,
    )
  }

  override async getMigrations(): Promise<unknown[]> {
    return this.fsSource.getMigrations(this.loadExtensions)
  }

  override getMigration(migration: unknown): Promise<Knex.Migration> {
    return this.fsSource.getMigration(migration)
  }

  getMigrationName(migration: Record<string, string>): string {
    return path.parse(migration.file).name
  }
}
