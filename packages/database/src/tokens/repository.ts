import { PostgresDatabase } from '../kysely'
import { selectTokenMeta } from './select'

export class TokensRepository {
  constructor(private readonly db: PostgresDatabase) {}

  findMany() {
    return this.db.selectFrom('Test').select(selectTokenMeta).execute()
  }
}
