/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server. 

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { layer2s } from '@l2beat/config'
import { LivenessType, notUndefined } from '@l2beat/shared-pure'
import { Knex } from 'knex'

import { makeLivenessTransfer } from '../../../modules/liveness/types/LivenessConfig'

export async function up(knex: Knex) {
  const transfersToUpdate = layer2s.flatMap((l2) => {
    const batchSubmissions = l2.config.liveness?.batchSubmissions
      .map((c) => {
        if (c.formula === 'transfer') {
          return {
            ...c,
            projectId: l2.id,
            type: LivenessType('DA'),
          }
        }
      })
      .filter(notUndefined)
    const stateUpdates = l2.config.liveness?.stateUpdates
      .map((c) => {
        if (c.formula === 'transfer') {
          return {
            ...c,
            projectId: l2.id,
            type: LivenessType('STATE'),
          }
        }
      })
      .filter(notUndefined)
    return [...(batchSubmissions ?? []), ...(stateUpdates ?? [])]
  })

  for (const config of transfersToUpdate) {
    await knex('liveness_configuration')
      .update({
        // @ts-expect-error schema has changed
        params: JSON.stringify({
          from: config.from.toString(),
          to: config.to.toString(),
        }),
      })
      .where('identifier', '=', makeLivenessTransfer(config).id)
  }
}

export async function down(knex: Knex) {
  const transfersToUpdate = layer2s.flatMap((l2) => {
    const batchSubmissions = l2.config.liveness?.batchSubmissions
      .map((c) => {
        if (c.formula === 'transfer') {
          return {
            ...c,
            projectId: l2.id,
            type: LivenessType('DA'),
          }
        }
      })
      .filter(notUndefined)
    const stateUpdates = l2.config.liveness?.stateUpdates
      .map((c) => {
        if (c.formula === 'transfer') {
          return {
            ...c,
            projectId: l2.id,
            type: LivenessType('STATE'),
          }
        }
      })
      .filter(notUndefined)
    return [...(batchSubmissions ?? []), ...(stateUpdates ?? [])]
  })

  for (const config of transfersToUpdate) {
    await knex('liveness_configuration')
      .update({
        // @ts-expect-error schema has changed
        params: JSON.stringify({
          from: config.from.toString(),
          to: config.from.toString(),
        }),
      })
      // TODO: this migration will break, what to do with it?
      .where('identifier', '=', makeLivenessTransfer(config).id)
  }
}
