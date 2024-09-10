import { PrismaClient } from '../../../db/prisma.js'

export function byTokenChainId({ db }: { db: PrismaClient }) {
  return async (event: { tokenId: string }) => {
    const token = await db.token.findFirstOrThrow({
      where: { id: event.tokenId },
      include: { network: true },
    })

    return token.network.chainId
  }
}
