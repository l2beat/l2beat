'use server'

import { revalidatePath } from 'next/cache'
import { db } from '~/db'
import { actionClient } from '~/lib/safe-action'
import {
  bridgeIdSchema,
  insertBridgeSchema,
  updateBridgeSchema,
} from './schemas'

export const insertBridge = actionClient
  .schema(insertBridgeSchema)
  .action(async ({ parsedInput }) => {
    revalidatePath('/', 'layout')
    try {
      const id = await db.externalBridge.insert(parsedInput)
      return { success: { id } }
    } catch {
      return { failure: 'Failed to insert bridge' }
    }
  })

export const updateBridge = actionClient
  .schema(updateBridgeSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput
    revalidatePath('/', 'layout')
    try {
      await db.externalBridge.update(id, data)
      return { success: { id } }
    } catch {
      return { failure: 'Failed to update bridge' }
    }
  })

export const deleteBridge = actionClient
  .schema(bridgeIdSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput
    revalidatePath('/', 'layout')
    try {
      await db.externalBridge.delete(id)
      return { success: { id } }
    } catch {
      return { failure: 'Failed to delete bridge' }
    }
  })
