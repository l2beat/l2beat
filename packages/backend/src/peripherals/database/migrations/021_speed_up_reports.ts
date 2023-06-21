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

import { SIX_HOURS } from '../ReportRepository'

const sixHourlyIndex = 'reports_unix_timestamp_six_hourly_index'
const dailyIndex = 'reports_unix_timestamp_daily_index'
const create = (name: string, time: number) =>
  `create index if not exists ${name} on reports (unix_timestamp, project_id, asset_id) where unix_timestamp % ${time} = 0`
const drop = (name: string) => `drop index ${name}`

export async function up(knex: Knex) {
  await knex.schema.raw(create(sixHourlyIndex, SIX_HOURS))
  await knex.schema.raw(create(dailyIndex, UnixTime.DAY))
}

export async function down(knex: Knex) {
  await knex.schema.raw(drop(sixHourlyIndex))
  await knex.schema.raw(drop(dailyIndex))
}
