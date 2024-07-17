/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server.

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { Knex } from 'knex'

import * as old from './020_events'

export async function up(knex: Knex) {
  await old.down(knex)
}

export async function down(knex: Knex) {
  await old.up(knex)
}
