import { tokenList } from '../../src/tokens'
import { chainIdNames } from './chainIdNames'
import { MultichainConfig } from './types'

export function generateOutput(config: MultichainConfig) {
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

  return configFile
}
