'use server'

import { revalidatePath } from 'next/cache'
import { db } from '~/db'
import { actionClient } from '~/lib/safe-action'
import {
  entityIdSchema,
  insertEntitySchema,
  updateEntitySchema,
} from './schemas'

export const insertEntity = actionClient
  .schema(insertEntitySchema)
  .action(async ({ parsedInput }) => {
    revalidatePath('/', 'layout')
    try {
      const id = await db.entity.insert(parsedInput)
      return { success: { id } }
    } catch (e) {
      return { failure: `Failed to insert entity: ${e as string}` }
    }
  })

export const updateEntity = actionClient
  .schema(updateEntitySchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput
    revalidatePath('/', 'layout')
    try {
      await db.entity.update(id, data)
      return { success: { id } }
    } catch (e) {
      return { failure: `Failed to update entity: ${e as string}` }
    }
  })

export const deleteEntity = actionClient
  .schema(entityIdSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput
    revalidatePath('/', 'layout')
    try {
      await db.entity.delete(id)
      return { success: { id } }
    } catch (e) {
      return { failure: `Failed to delete entity: ${e as string}` }
    }
  })
