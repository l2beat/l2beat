'use server'

import { revalidatePath } from 'next/cache'
import { db } from '~/db'
import { actionClient } from '~/lib/safe-action'
import { insertTokenSchema, tokenIdSchema, updateTokenSchema } from './schemas'

export const insertToken = actionClient
  .schema(insertTokenSchema)
  .action(async ({ parsedInput }) => {
    revalidatePath('/', 'layout')
    const { relations, customMeta, ...data } = parsedInput
    try {
      const { id } = await db.token.insert(data)
      return { success: { id } }
    } catch {
      return { failure: 'Failed to insert network' }
    }
  })

export const updateToken = actionClient
  .schema(updateTokenSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput
    revalidatePath('/', 'layout')
    try {
      await db.token.update(id, data)
      return { success: { id } }
    } catch {
      return { failure: 'Failed to update network' }
    }
  })

export const deleteToken = actionClient
  .schema(tokenIdSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput
    revalidatePath('/', 'layout')
    try {
      await db.token.delete(id)
      return { success: { id } }
    } catch {
      return { failure: 'Failed to delete token' }
    }
  })
