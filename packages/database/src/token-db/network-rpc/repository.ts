import { BaseRepository } from '../../BaseRepository'
import { NetworkRpcRecord, toRow } from './entity'

export class NetworkRpcRepository extends BaseRepository {
  insertMany(rpcs: NetworkRpcRecord[]) {
    const entities = rpcs.map(toRow)

    return this.db.insertInto('public.NetworkRpc').values(entities).execute()
  }
}
