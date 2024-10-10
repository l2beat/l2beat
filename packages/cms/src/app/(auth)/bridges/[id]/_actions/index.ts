'use server'

import { db } from '~/db'
import { actionClient } from '~/lib/safe-action'
import { insertBridgeSchema, updateBridgeSchema } from './schemas'
import { revalidatePath } from 'next/cache'

export const insertBridge = actionClient
  .schema(insertBridgeSchema)
  .action(async ({ parsedInput }) => {
    revalidatePath('/', 'layout')
    try {
      const id = await db.externalBridge.insert(parsedInput)
      return { success: { id } }
    } catch (error) {
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
    } catch (error) {
      return { failure: 'Failed to update bridge' }
    }
  })
