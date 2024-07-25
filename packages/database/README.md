# @l2beat/database

## Repository implementation convention

Please follow this example when implementing a repository. Take note of function names, function arguments, variable names and function return types.

```typescript
import { BaseRepository } from "../../BaseRepository";
import { Record, toRecord, toRow } from "./entity";
import { selectExample } from "./select";

class ExampleRepository extends BaseRepository {
  /** Returns all records. */
  getAll(): Promise<Record[]> {
    const rows = this.db
      .selectFrom("example_column")
      .select(selectExample)
      .execute();
    return rows.map(toRecord);
  }

  /** Returns filtered records. */
  getByType(type: string): Promise<Record[]> {
    const rows = this.db
      .selectFrom("example_column")
      .select(selectExample)
      .where("type", "=", type)
      .execute();
    return rows.map(toRecord);
  }

  /** Returns a single record. */
  findById(id: string): Promise<Record | undefined> {
    const row = this.db
      .selectFrom("example_column")
      .select(selectExample)
      .where("id", "=", id)
      .limit(1) // VERY IMPORTANT!
      .executeTakeFirst();
    return row && toRecord(row);
  }

  /** Creates a new record. */
  insert(record: Record): Promise<void> {
    await this.insertMany([record]);
  }

  /** Alternative: Returning id. */
  insert(record: Omit<Record, "id">): Promise<number> {
    const [id] = await this.insertMany([record]);
    // biome-ignore lint/style/noNonNullAssertion: guaranteed by the query
    return id!;
  }

  /** Creates many records. Returns number of records created. */
  insertMany(records: Record[]): Promise<number> {
    const rows = records.map(toRow);
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto("example_column").values(batch).execute();
    });
    return rows.length;
  }

  /** Alternative: Returning ids. */
  insertMany(records: Omit<Record, "id">[]): Promise<number[]> {
    const rows = records.map(toRow);
    const ids: number[] = [];
    await this.batch(rows, 1_000, async (batch) => {
      const results = await this.db
        .insertInto("example_column")
        .values(batch)
        .returning("id")
        .execute();
      // TODO: This doesn't return ids in the correct order!
      ids.push(...results.map((result) => result.id));
    });
    return ids;
  }

  /** Creates or updates a record. */
  upsert(record: Record): Promise<void> {
    await this.upsertMany([record]);
  }

  /** Creates or updates many records. */
  upsertMany(records: Record[]): Promise<number> {
    const rows = records.map(toRow);
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto("example_column")
        .values(batch)
        .onConflict((cb) =>
          cb.columns(["id"]).doUpdateSet((eb) => ({
            foo: eb.ref("excluded.foo"),
            bar: eb.ref("excluded.bar"),
          }))
        )
        .execute();
    });
    return records.length;
  }

  /** Removes all records. Returns number of deleted records. */
  deleteAll(): Promise<number> {
    const result = this.db.deleteFrom("example_column").executeTakeFirst();
    return Number(result.numDeletedRows);
  }

  /** Removes matching records. Returns number of deleted records. */
  deleteByType(type: string): Promise<void> {
    const result = this.db
      .deleteFrom("example_column")
      .where("type", "=", type)
      .executeTakeFirst();
    return Number(result.numDeletedRows);
  }
}
```
