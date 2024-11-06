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
    return await db.transaction(async () => {
      try {
        const { id } = await db.token.insert(data)
        await db.tokenBridge.upsertMany(
          relations.map((relation) => {
            if ('sourceTokenId' in relation) {
              return {
                ...relation,
                targetTokenId: id,
              }
            }
            return {
              ...relation,
              sourceTokenId: id,
            }
          }),
        )
        await db.tokenMeta.upsert({
          tokenId: id,
          externalId: '',
          source: 'Overrides',
          symbol: customMeta?.symbol ?? null,
          name: customMeta?.name ?? null,
          logoUrl: customMeta?.logoUrl ?? null,
          decimals: customMeta?.decimals ?? null,
          contractName: customMeta?.contractName ?? null,
        })
        return { success: { id } }
      } catch (e) {
        return { failure: `Failed to insert token: ${e as string}` }
      }
    })
  })

export const updateToken = actionClient
  .schema(updateTokenSchema)
  .action(async ({ parsedInput }) => {
    const { id, relations, customMeta, ...data } = parsedInput
    revalidatePath('/', 'layout')
    return await db.transaction(async () => {
      try {
        await db.token.update(id, data)
        await db.tokenBridge.deleteByTokenId(id)
        await db.tokenBridge.upsertMany(
          relations.map((relation) => {
            if ('sourceTokenId' in relation) {
              return {
                ...relation,
                targetTokenId: id,
              }
            }
            return {
              ...relation,
              sourceTokenId: id,
            }
          }),
        )
        await db.tokenMeta.upsert({
          tokenId: id,
          externalId: '',
          source: 'Overrides',
          symbol: customMeta?.symbol ?? null,
          name: customMeta?.name ?? null,
          logoUrl: customMeta?.logoUrl ?? null,
          decimals: customMeta?.decimals ?? null,
          contractName: customMeta?.contractName ?? null,
        })
        return { success: { id } }
      } catch (e) {
        return { failure: `Failed to update token: ${e as string}` }
      }
    })
  })

export const deleteToken = actionClient
  .schema(tokenIdSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput
    revalidatePath('/', 'layout')
    try {
      await db.token.delete(id)
      return { success: { id } }
    } catch (e) {
      return { failure: `Failed to delete token: ${e as string}` }
    }
  })
