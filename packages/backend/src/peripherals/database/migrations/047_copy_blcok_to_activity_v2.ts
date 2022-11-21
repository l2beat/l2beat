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
  await knex.schema.raw(copyBlockTransactionCounts)
  await knex.schema.raw(updateBlockProcessors)
  await knex.schema.raw(assertBlockTransactionCountsMatchProcessors)
}

export async function down(_knex: Knex) {}

const copyBlockTransactionCounts = `
  insert into activity_v2.block (project_id, block_number, count, unix_timestamp)
  select project_id, block_number, count, unix_timestamp
  from transactions.block b1 where
    block_number <= (select block_number from transactions.block_tip where project_id = b1.project_id)
    and
    block_number > (select last_processed from sequence_processor where id = b1.project_id)
`
const updateBlockProcessors = `
  insert into sequence_processor (id, last_processed, finished_processing_at)
  select project_id, max(block_number), now()::timestamp from activity_v2.block group by project_id
  on conflict (id) do update set
    last_processed = excluded.last_processed,
    finished_processing_at = excluded.finished_processing_at
`
const assertBlockTransactionCountsMatchProcessors = `
  do $$
  declare
    r record;
  begin
    for r in
      select
        min(block_number),
        max(block_number),
        count(*),
        last_processed
      from activity_v2.block
      join sequence_processor
      on project_id = id
      group by project_id, last_processed
    loop
      assert r.count = (r.max - r.min + 1)::bigint, 'Incorrect count';
      assert r.max = r.last_processed, 'Incorrect max';
    end loop;
  end; $$
`
