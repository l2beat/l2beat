import { writeFile } from 'fs/promises'
import { tokenList } from '@l2beat/config'
import { chainIdNames } from './chainIdNames'
import { fetchMultichainConfig } from './fetchMultichainConfig'

/*

Escrows:

1. Get all escrows through swapin & swapout as usual
2. Download all token lists for all known chainIds
2.5 https://bridgeapi.anyswap.exchange/v4/tokenlistv4/all
3. Find destinations leading back to chainid 1
4. Add those escrows

AnyTokens:

anyDAI (1) -> underlying: DAI (1)
anyDAI (250) -> underlying: DAI (250)

Goal: list all any* on Ethereum with underlying

*/

main()
async function main() {
  const config = await fetchMultichainConfig()

  const escrows = []
  const chainIds = new Set<string>()
  const specTypes = new Set<string>()

  const ethereumConfig = config['1']

  for (const [key, token] of Object.entries(ethereumConfig)) {
    for (const [id, chain] of Object.entries(token.destChains)) {
      chainIds.add(id)
      for (const [hash, spec] of Object.entries(chain)) {
        specTypes.add(spec.type)
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
  console.log(specTypes)

  writeFile('src/bridges/multichain.json', JSON.stringify(configFile, null, 2))
}
