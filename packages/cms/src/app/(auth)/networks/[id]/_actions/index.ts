'use server'

import { revalidatePath } from 'next/cache'
import { db } from '~/db'
import { actionClient } from '~/lib/safe-action'
import {
  insertNetworkSchema,
  networkIdSchema,
  updateNetworkSchema,
} from './schemas'

export const insertNetwork = actionClient
  .schema(insertNetworkSchema)
  .action(async ({ parsedInput }) => {
    revalidatePath('/', 'layout')
    const { explorers, rpcs, ...data } = parsedInput
    try {
      const id = await db.transaction(async () => {
        const { id: networkId } = await db.network.insert(data)
        await db.networkExplorer.insertMany(
          explorers.map((explorer) => ({ ...explorer, networkId })),
        )
        await db.networkRpc.insertMany(
          rpcs.map((rpc) => ({ ...rpc, networkId })),
        )
        return networkId
      })
      return { success: { id } }
    } catch {
      return { failure: 'Failed to insert network' }
    }
  })

export const updateNetwork = actionClient
  .schema(updateNetworkSchema)
  .action(async ({ parsedInput }) => {
    const { id, explorers, rpcs, ...data } = parsedInput
    revalidatePath('/', 'layout')
    try {
      await db.transaction(async () => {
        await db.network.update(id, data)
        await db.networkExplorer.deleteManyByNetworkId(id)
        await db.networkRpc.deleteManyByNetworkId(id)
        await db.networkExplorer.insertMany(
          explorers.map((explorer) => ({ ...explorer, networkId: id })),
        )
        await db.networkRpc.insertMany(
          rpcs.map((rpc) => ({ ...rpc, networkId: id })),
        )
      })
      return { success: { id } }
    } catch {
      return {
        failure: 'Failed to update network',
      }
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
    } catch {
      return { failure: 'Failed to delete network' }
    }
  })
