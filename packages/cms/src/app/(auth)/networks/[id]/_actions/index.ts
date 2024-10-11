'use server'

import { db } from '~/db'
import { actionClient } from '~/lib/safe-action'
import {
  networkIdSchema,
  insertNetworkSchema,
  updateNetworkSchema,
} from './schemas'
import { revalidatePath } from 'next/cache'

export const insertNetwork = actionClient
  .schema(insertNetworkSchema)
  .action(async ({ parsedInput }) => {
    revalidatePath('/', 'layout')
    try {
      const id = await db.network.insert(parsedInput)
      return { success: { id } }
    } catch (_) {
      return { failure: 'Failed to insert network' }
    }
  })

export const updateNetwork = actionClient
  .schema(updateNetworkSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput
    revalidatePath('/', 'layout')
    try {
      await db.network.update(id, data)
      return { success: { id } }
    } catch (_) {
      return { failure: 'Failed to update network' }
    }
  })

export const deleteNetwork = actionClient
  .schema(networkIdSchema)
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
