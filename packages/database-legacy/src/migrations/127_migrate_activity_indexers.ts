import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/
const projects: { name: string; type: 'block' | 'day' }[] = [
  { name: 'aevo', type: 'block' },
  { name: 'alienx', type: 'block' },
  { name: 'ancient', type: 'block' },
  { name: 'apex', type: 'day' },
  { name: 'arbitrum', type: 'block' },
  { name: 'astarzkevm', type: 'block' },
  { name: 'base', type: 'block' },
  { name: 'blast', type: 'block' },
  { name: 'bob', type: 'block' },
  { name: 'bobanetwork', type: 'block' },
  { name: 'brine', type: 'day' }, //tanx
  { name: 'cyber', type: 'block' },
  { name: 'degate3', type: 'block' },
  { name: 'degen', type: 'block' },
  { name: 'deversifi', type: 'block' }, //rhinofi
  { name: 'dydx', type: 'day' },
  { name: 'ethereum', type: 'block' },
  { name: 'fraxtal', type: 'block' },
  { name: 'gpt', type: 'block' },
  { name: 'ham', type: 'block' },
  { name: 'hook', type: 'block' },
  { name: 'hychain', type: 'block' },
  { name: 'immutablex', type: 'day' },
  { name: 'karak', type: 'block' },
  { name: 'kinto', type: 'block' },
  { name: 'kroma', type: 'block' },
  { name: 'l3x', type: 'block' },
  { name: 'lambda', type: 'block' },
  { name: 'linea', type: 'block' },
  { name: 'lisk', type: 'block' },
  { name: 'loopring', type: 'block' },
  { name: 'lyra', type: 'block' },
  { name: 'mantapacific', type: 'block' },
  { name: 'mantle', type: 'block' },
  { name: 'metal', type: 'block' },
  { name: 'metis', type: 'block' },
  { name: 'mint', type: 'block' },
  { name: 'mode', type: 'block' },
  { name: 'molten', type: 'block' },
  { name: 'myria', type: 'day' },
  { name: 'nova', type: 'block' },
  { name: 'optimism', type: 'block' },
  { name: 'optopia', type: 'block' },
  { name: 'orderly', type: 'block' },
  { name: 'parallel', type: 'block' },
  { name: 'patex', type: 'block' },
  { name: 'polygonzkevm', type: 'block' },
  { name: 'popapex', type: 'block' },
  { name: 'publicgoodsnetwork', type: 'block' },
  { name: 'rari', type: 'block' },
  { name: 'real', type: 'block' },
  { name: 'redstone', type: 'block' },
  { name: 'rss3', type: 'block' },
  { name: 'sanko', type: 'block' },
  { name: 'scroll', type: 'block' },
  { name: 'sorare', type: 'day' },
  { name: 'stack', type: 'block' },
  { name: 'starknet', type: 'block' },
  { name: 'swan', type: 'block' },
  { name: 'sxnetwork', type: 'block' },
  { name: 'syndicateframe', type: 'block' },
  { name: 'taiko', type: 'block' },
  { name: 'witness', type: 'block' },
  { name: 'xai', type: 'block' },
  { name: 'xlayer', type: 'block' },
  { name: 'xterio', type: 'block' },
  { name: 'zircuit', type: 'block' },
  { name: 'zklinknova', type: 'block' },
  { name: 'zksync', type: 'block' },
  { name: 'zksync2', type: 'block' },
  { name: 'zora', type: 'block' },
]

const timestamp = UnixTime.fromDate(new Date('2024-08-08T00:00:00Z'))

export async function up(knex: Knex) {
  await knex('indexer_state').insert(
    projects.map((p) => ({
      indexer_id:
        p.type === 'block'
          ? `activity_block_indexer::${p.name}`
          : `activity_day_indexer::${p.name}`,
      safe_height: timestamp.toNumber(),
    })),
  )
}

export async function down(knex: Knex) {
  await knex('indexer_state')
    .delete()
    .whereLike('indexer_id', 'activity_block_indexer%')
    .orWhereLike('indexer_id', 'activity_day_indexer%')
}
