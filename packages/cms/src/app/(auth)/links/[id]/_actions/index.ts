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
    const { managingEntities, ...data } = parsedInput
    return await db.transaction(async () => {
      try {
        const { id: externalBridgeId } = await db.externalBridge.insert(data)
        await db.entityToExternalBridge.upsertManyOfExternalBridgeId(
          managingEntities.map(({ entityId }) => ({
            externalBridgeId,
            entityId,
          })),
        )
        return { success: { id: externalBridgeId } }
      } catch (e) {
        return { failure: `Failed to insert link: ${e as string}` }
      }
    })
  })

export const updateBridge = actionClient
  .schema(updateBridgeSchema)
  .action(async ({ parsedInput }) => {
    const { id, managingEntities, ...data } = parsedInput
    revalidatePath('/', 'layout')
    return await db.transaction(async () => {
      try {
        await db.externalBridge.update(id, data)
        await db.entityToExternalBridge.deleteByExternalBridgeId(id)
        await db.entityToExternalBridge.upsertManyOfExternalBridgeId(
          managingEntities.map(({ entityId }) => ({
            externalBridgeId: id,
            entityId,
          })),
        )
        return { success: { id } }
      } catch (e) {
        return { failure: `Failed to update link: ${e as string}` }
      }
    })
  })

export const deleteBridge = actionClient
  .schema(bridgeIdSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput
    revalidatePath('/', 'layout')
    return await db.transaction(async () => {
      try {
        await db.entityToExternalBridge.deleteByExternalBridgeId(id)
        await db.externalBridge.delete(id)
        return { success: { id } }
      } catch (e) {
        return { failure: `Failed to delete link: ${e as string}` }
      }
    })
  })
