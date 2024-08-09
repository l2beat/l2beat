/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

const projects: { name: string; indexerType: 'block' | 'day' }[] = [
  { name: 'aevo', indexerType: 'block' },
  { name: 'alienx', indexerType: 'block' },
  { name: 'ancient', indexerType: 'block' },
  { name: 'apex', indexerType: 'day' },
  { name: 'arbitrum', indexerType: 'block' },
  { name: 'astarzkevm', indexerType: 'block' },
  { name: 'base', indexerType: 'block' },
  { name: 'blast', indexerType: 'block' },
  { name: 'bob', indexerType: 'block' },
  { name: 'bobanetwork', indexerType: 'block' },
  { name: 'brine', indexerType: 'day' }, //tanx
  { name: 'cyber', indexerType: 'block' },
  { name: 'degate3', indexerType: 'block' },
  { name: 'degen', indexerType: 'block' },
  { name: 'deversifi', indexerType: 'block' }, //rhinofi
  { name: 'dydx', indexerType: 'day' },
  { name: 'ethereum', indexerType: 'block' },
  { name: 'fraxtal', indexerType: 'block' },
  { name: 'gpt', indexerType: 'block' },
  { name: 'ham', indexerType: 'block' },
  { name: 'hook', indexerType: 'block' },
  { name: 'hychain', indexerType: 'block' },
  { name: 'immutablex', indexerType: 'day' },
  { name: 'karak', indexerType: 'block' },
  { name: 'kinto', indexerType: 'block' },
  { name: 'kroma', indexerType: 'block' },
  { name: 'l3x', indexerType: 'block' },
  { name: 'lambda', indexerType: 'block' },
  { name: 'linea', indexerType: 'block' },
  { name: 'lisk', indexerType: 'block' },
  { name: 'loopring', indexerType: 'block' },
  { name: 'lyra', indexerType: 'block' },
  { name: 'mantapacific', indexerType: 'block' },
  { name: 'mantle', indexerType: 'block' },
  { name: 'metal', indexerType: 'block' },
  { name: 'metis', indexerType: 'block' },
  { name: 'mint', indexerType: 'block' },
  { name: 'mode', indexerType: 'block' },
  { name: 'molten', indexerType: 'block' },
  { name: 'myria', indexerType: 'day' },
  { name: 'nova', indexerType: 'block' },
  { name: 'optimism', indexerType: 'block' },
  { name: 'optopia', indexerType: 'block' },
  { name: 'orderly', indexerType: 'block' },
  { name: 'parallel', indexerType: 'block' },
  { name: 'patex', indexerType: 'block' },
  { name: 'polygonzkevm', indexerType: 'block' },
  { name: 'popapex', indexerType: 'block' },
  { name: 'publicgoodsnetwork', indexerType: 'block' },
  { name: 'rari', indexerType: 'block' },
  { name: 'real', indexerType: 'block' },
  { name: 'redstone', indexerType: 'block' },
  { name: 'rss3', indexerType: 'block' },
  { name: 'sanko', indexerType: 'block' },
  { name: 'scroll', indexerType: 'block' },
  { name: 'sorare', indexerType: 'day' },
  { name: 'stack', indexerType: 'block' },
  { name: 'starknet', indexerType: 'block' },
  { name: 'swan', indexerType: 'block' },
  { name: 'sxnetwork', indexerType: 'block' },
  { name: 'syndicateframe', indexerType: 'block' },
  { name: 'taiko', indexerType: 'block' },
  { name: 'witness', indexerType: 'block' },
  { name: 'xai', indexerType: 'block' },
  { name: 'xlayer', indexerType: 'block' },
  { name: 'xterio', indexerType: 'block' },
  { name: 'zircuit', indexerType: 'block' },
  { name: 'zklinknova', indexerType: 'block' },
  { name: 'zksync', indexerType: 'block' },
  { name: 'zksync2', indexerType: 'block' },
  { name: 'zora', indexerType: 'block' },
]

const timestamp = UnixTime.fromDate(new Date('2024-08-08T00:00:00Z'))

export async function up(knex: Knex) {
  await knex('indexer_state')
    .delete()
    .whereLike('indexer_id', 'activity_block_indexer%')
    .orWhereLike('indexer_id', 'activity_day_indexer%')

  await knex('indexer_state').insert(
    projects.map((p) => ({
      indexer_id:
        p.indexerType === 'block'
          ? `activity_block_indexer::${p.name}`
          : `activity_day_indexer::${p.name}`,
      safe_height: timestamp.toNumber(),
    })),
  )

  await knex('activity').delete()

  // migrate zksync activity
  await knex('activity').insert(
    knex
      .select(
        knex.raw("'zksync'::character varying AS project_id"),
        knex.raw("date_trunc('day', zksync.unix_timestamp) AS day_timestamp"),
        knex.raw('count(*) AS count'),
        knex.raw('min(block_number) AS start'),
        knex.raw('max(block_number) AS end'),
      )
      .from('activity.zksync')
      .where('zksync.unix_timestamp', '<', timestamp.toDate())
      .groupByRaw("date_trunc('day', zksync.unix_timestamp)"),
  )

  // migrate block activity
  await knex('activity').insert(
    knex
      .select(
        'block.project_id',
        knex.raw("date_trunc('day', block.unix_timestamp) AS day_timestamp"),
        knex.raw('sum(block.count) AS count'),
        knex.raw('min(block.block_number) AS start'),
        knex.raw('max(block.block_number) AS end'),
      )
      .whereIn(
        'project_id',
        projects.map((p) => p.name),
      )
      .andWhere('block.unix_timestamp', '<', timestamp.toDate())
      .from('activity.block')
      .groupByRaw("date_trunc('day', block.unix_timestamp), block.project_id"),
  )

  // migrate starkex activity
  await knex('activity').insert(
    knex
      .select(
        'starkex.project_id',
        'starkex.unix_timestamp',
        'starkex.count',
        knex.raw('extract(epoch from starkex.unix_timestamp) AS start'),
        knex.raw(
          "extract(epoch from (date_trunc('day', starkex.unix_timestamp) + interval '1 day' - interval '1 second')) AS end",
        ),
      )
      .whereIn(
        'project_id',
        projects.map((p) => p.name),
      )
      .andWhere('starkex.unix_timestamp', '<', timestamp.toDate())
      .from('activity.starkex')
      .groupBy('starkex.unix_timestamp', 'starkex.project_id'),
  )
}

export async function down(knex: Knex) {
  await knex('indexer_state')
    .delete()
    .whereLike('indexer_id', 'activity_block_indexer%')
    .orWhereLike('indexer_id', 'activity_day_indexer%')

  await knex('activity').delete()
}
