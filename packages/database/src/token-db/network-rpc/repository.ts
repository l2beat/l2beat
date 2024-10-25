import { BaseRepository } from "../../BaseRepository";
import { UpsertableNetworkRpcRecord, upsertableToRow } from "./entity";

export class NetworkRpcRepository extends BaseRepository {
  async insertMany(records: UpsertableNetworkRpcRecord[]): Promise<number> {
    if (records.length === 0) return 0;

    const rows = records.map(upsertableToRow);
    await this.batch(rows, 100, async (batch) => {
      await this.db.insertInto("NetworkRpc").values(batch).execute();
    });
    return records.length;
  }

  async deleteManyByNetworkId(networkId: string): Promise<bigint> {
    const res = await this.db
      .deleteFrom("NetworkRpc")
      .where("networkId", "=", networkId)
      .executeTakeFirstOrThrow();
    return res.numDeletedRows;
  }
}
