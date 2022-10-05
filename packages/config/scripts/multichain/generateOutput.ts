import { EthereumAddress } from '@l2beat/types'
import { MultichainConfig } from './types'

interface GroupedEscrow {
  address: EthereumAddress
  type: string
  chainIds: string[]
  tokens: { name: string; symbol: string; address: EthereumAddress | 'ETH' }[]
}

export function generateOutput(config: MultichainConfig) {
  const escrows = []
  const ETHEREUM = '1'

  for (const [source, tokens] of Object.entries(config)) {
    for (const token of Object.values(tokens)) {
      for (const [destination, routes] of Object.entries(token.destChains)) {
        for (const route of Object.values(routes)) {
          if (
            (source === ETHEREUM && route.type === 'swapin') ||
            (destination === ETHEREUM && route.type === 'swapout')
          ) {
            const token =
              route.chainId === ETHEREUM
                ? {
                    address: addressOrEth(route.address),
                    name: route.name ?? '?',
                    symbol: route.symbol ?? '?',
                  }
                : {
                    address: addressOrEth(route.fromanytoken.address),
                    name: route.fromanytoken.name ?? '?',
                    symbol: route.fromanytoken.symbol ?? '?',
                  }

            escrows.push({
              chainId: source !== ETHEREUM ? source : destination,
              type: 'basic',
              token,
              address: EthereumAddress(route.DepositAddress),
            })
          }

          if (
            destination === ETHEREUM &&
            route.type === 'NATIVE' &&
            route.anytoken &&
            route.underlying
          ) {
            escrows.push({
              chainId: source !== ETHEREUM ? source : destination,
              type: 'any',
              token: {
                address: addressOrEth(route.underlying.address),
                name: route.underlying.name ?? '?',
                symbol: route.underlying.symbol ?? '?',
              },
              address: EthereumAddress(route.anytoken.address),
            })
          }
        }
      }
    }
  }

  const groupedEscrows: GroupedEscrow[] = []
  for (const escrow of escrows) {
    const existing = groupedEscrows.find((x) => x.address === escrow.address)
    if (existing) {
      if (!existing.chainIds.includes(escrow.chainId)) {
        existing.chainIds.push(escrow.chainId)
      }
      if (!existing.tokens.some((x) => x.address === escrow.token.address)) {
        existing.tokens.push(escrow.token)
      }
    } else {
      groupedEscrows.push({
        address: escrow.address,
        type: escrow.type,
        chainIds: [escrow.chainId],
        tokens: [escrow.token],
      })
    }
  }

  return { escrows: groupedEscrows }
}

function addressOrEth(address: string): EthereumAddress | 'ETH' {
  if (address === 'ETH') {
    return address
  }
  return EthereumAddress(address)
}
