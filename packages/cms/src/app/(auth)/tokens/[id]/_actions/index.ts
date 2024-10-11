'use server'

import { db } from '~/db'
import { actionClient } from '~/lib/safe-action'
import { tokenIdSchema, insertTokenSchema, updateTokenSchema } from './schemas'
import { revalidatePath } from 'next/cache'

export const insertToken = actionClient
  .schema(insertTokenSchema)
  .action(async ({ parsedInput }) => {
    revalidatePath('/', 'layout')
    const { relations, customMeta, ...data } = parsedInput
    try {
      const id = await db.transaction(async () => {
        const { id: networkId } = await db.token.insert(data)
        return networkId
      })
      return { success: { id } }
    } catch (_) {
      return { failure: 'Failed to insert network' }
    }
  })

export const updateToken = actionClient
  .schema(updateTokenSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput
    revalidatePath('/', 'layout')
    try {
      await db.transaction(async () => {
        await db.token.update(id, data)
      })
      return { success: { id } }
    } catch (_) {
      return {
        failure: 'Failed to update network, reason: ' + JSON.stringify(_),
      }
    }
  })

export const deleteToken = actionClient
  .schema(tokenIdSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput
    revalidatePath('/', 'layout')
    try {
      await db.network.delete(id)
      return { success: { id } }
    } catch (_) {
      return { failure: 'Failed to delete network' }
    }
  })
