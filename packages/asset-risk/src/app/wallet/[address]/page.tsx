import '~/utils/chains'

import { tokenList } from '@l2beat/config'
import { type Token } from '@l2beat/shared-pure'

export default async function Page({
  params: { address },
}: {
  params: { address: string }
}) {
  const groupedTokens = tokenList.reduce<Partial<Record<number, Token[]>>>(
    (acc, token) => {
      const chainId = Number(token.chainId)
      if (!acc[chainId]) {
        acc[chainId] = []
      }
      acc[chainId]?.push(token)
      return acc
    },
    {},
  )

  console.log(groupedTokens)

  return (
    <main>
      <h1>Hello {address}!</h1>
    </main>
  )
}
