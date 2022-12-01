/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server.

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.raw(copyZksyncTransactions)
  await knex.schema.raw(updateZksyncProcessor)
  await knex.schema.raw(assertZksyncMatchProcessor)
}

export async function down(_knex: Knex) {}

const copyZksyncTransactions = `
  insert into activity_v2.zksync (block_number, block_index, unix_timestamp)
  select block_number, block_index, unix_timestamp
  from transactions.zksync where block_number <= (select block_number from transactions.block_tip where project_id = 'zksync')
  on conflict do nothing
`
const updateZksyncProcessor = `
  insert into sequence_processor (id, last_processed, finished_processing_at)
  select 'zksync', coalesce(max(block_number), 0), now()::timestamp from activity_v2.zksync
  on conflict (id) do update set
    last_processed = excluded.last_processed,
    finished_processing_at = excluded.finished_processing_at
`
const assertZksyncMatchProcessor = `
  do $$
  declare
    r record;
  begin
    select min(block_number), max(block_number), count(distinct block_number), last_processed
    into r
    from activity_v2.zksync
    join sequence_processor
    on id = 'zksync'
    group by last_processed;

    if not found then
      raise notice 'no zksync data to copy';
    else
      assert r.count = (r.max - r.min + 1)::bigint, 'Incorrect count';
      assert r.max = r.last_processed, 'Incorrect max';
    end if;
  end; $$
`
