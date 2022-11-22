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
    block_number > coalesce((select last_processed from sequence_processor where id = b1.project_id), -1)
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
    tips_count bigint;
    r record;
    copied_counter int = 0;
  begin
    tips_count = (select count(*) from transactions.block_tip where project_id <> 'zksync');
    if tips_count = 0 then
      raise notice 'there was no block data to copy';
    else
      for r in select
        min(v2.block_number),
        max(v2.block_number),
        count(v2.block_number),
        last_processed,
        tip.block_number tip
      from transactions.block_tip tip
      inner join activity_v2.block v2 on v2.project_id = tip.project_id
      inner join sequence_processor on id = tip.project_id
      group by tip.project_id, last_processed, tip.block_number
      loop
        assert r.count = (r.max - r.min + 1)::bigint, 'Incorrect count';
        assert r.max = r.last_processed, 'Incorrect max';
        copied_counter = copied_counter + 1;
      end loop;
      raise notice 'v1 projects: %, copied: %', tips_count, copied_counter;
      assert tips_count = copied_counter, 'Not all v1 projects copied';
    end if;
  end; $$
`
