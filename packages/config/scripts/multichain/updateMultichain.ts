import { writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import { tokenList } from '@l2beat/config'
import { MultichainApiResponse } from './MultichainApiResponse'
import { chainIdNames } from './chainIdNames'

main()
async function main() {
  const res = await fetch('https://bridgeapi.anyswap.exchange/v4/tokenlistv4/1')
  const json: MultichainApiResponse = await res.json()

  const escrows = []
  const chainIds = new Set<string>()

  for (const [key, token] of Object.entries(json)) {
    for (const [id, chain] of Object.entries(token.destChains)) {
      chainIds.add(id)
      for (const [hash, spec] of Object.entries(chain)) {
        if (spec.type === 'swapin' || spec.type === 'swapout') {
          escrows.push({
            tokenName: token.name,
            tokenSymbol: token.symbol,
            tokenAddress: token.address,
            chainId: id,
            escrowAddress: spec.DepositAddress,
          })
        }
      }
    }
  }

  const groupedEscrowMap = new Map()
  for (const escrow of escrows) {
    const groupedEntry = groupedEscrowMap.get(escrow.escrowAddress) ?? {
      chainId: escrow.chainId,
      tokens: [],
    }
    groupedEscrowMap.set(escrow.escrowAddress, groupedEntry)
    if (escrow.chainId !== groupedEntry.chainId) {
      console.log({ escrow, groupedEntry })
      throw new Error('Duplicate chainId')
    }
    const token = tokenList.find(
      (x) => x.address?.toLowerCase() === escrow.tokenAddress.toLowerCase(),
    )
    if (token) {
      groupedEntry.tokens.push(token.symbol)
    } else {
      groupedEntry.tokens.push({
        unknown: true,
        name: escrow.tokenName,
        address: escrow.tokenAddress,
      })
    }
  }

  const groupedEscrows = [...groupedEscrowMap.entries()].map(
    ([address, entry]) => ({
      address,
      chainId: entry.chainId,
      tokens: entry.tokens,
    }),
  )

  const namedChainIds = [...chainIds].map((id) => ({
    chainId: id,
    name: chainIdNames.get(id) ?? null,
  }))

  const configFile = {
    escrows: groupedEscrows,
    chainIds: namedChainIds,
  }

  console.log('Total chains', namedChainIds.length)

  writeFile('src/bridges/multichain.json', JSON.stringify(configFile, null, 2))
}
