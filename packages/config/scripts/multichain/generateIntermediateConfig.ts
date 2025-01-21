import { EthereumAddress } from '@l2beat/shared-pure'

import { chainIdNames } from './chainIdNames'
import type { MultichainConfig } from './types'

interface GroupedEscrow {
  address: EthereumAddress
  type: string
  chainIds: string[]
  tokens: { name: string; symbol: string; address: EthereumAddress | 'ETH' }[]
}

export type IntermediateConfig = ReturnType<typeof generateIntermediateConfig>

export function generateIntermediateConfig(config: MultichainConfig) {
  const escrows = []
  const ETHEREUM = '1'

  const routeTypes = new Set<string>()

  for (const [source, tokens] of Object.entries(config)) {
    for (const token of Object.values(tokens)) {
      for (const [destination, routes] of Object.entries(token.destChains)) {
        for (const route of Object.values(routes)) {
          routeTypes.add(route.type)
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
            source === ETHEREUM &&
            ['STABLEV3', 'NATIVE', 'NON_EVM', 'UNDERLYINGV2'].includes(
              route.type,
            )
          ) {
            const tokenAddress = addressOrEth(token.address)
            const escrowAddress = EthereumAddress(route.fromanytoken.address)
            if (tokenAddress !== escrowAddress) {
              escrows.push({
                chainId: destination,
                type: 'any',
                token: {
                  address: tokenAddress,
                  name: token.name ?? '?',
                  symbol: token.symbol ?? '?',
                },
                address: escrowAddress,
              })
            }
          }
        }
      }
    }
  }

  const tokens = new Set<EthereumAddress | 'ETH'>()

  const groupedEscrows: GroupedEscrow[] = []
  for (const escrow of escrows) {
    tokens.add(escrow.token.address)
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

  const chainIds = new Set<string>()
  for (const escrow of groupedEscrows) {
    for (const chainId of escrow.chainIds) {
      chainIds.add(chainId)
    }
  }

  console.log({
    routeTypes: [...routeTypes],
    basicEscrows: groupedEscrows.filter((x) => x.type === 'basic').length,
    anyEscrows: groupedEscrows.filter((x) => x.type === 'any').length,
    lockedTokens: tokens.size,
    chains: chainIds.size,
  })

  return {
    chains: [...chainIds]
      .sort()
      .map((id) => ({ id, name: chainIdNames.get(id) })),
    escrows: groupedEscrows
      .map((x) => ({
        type: x.type,
        address: x.address,
        tokens: x.tokens.map((t) => t.address).sort(),
      }))
      .sort((a, b) => a.address.localeCompare(b.address.toString())),
  }
}

function addressOrEth(address: string): EthereumAddress | 'ETH' {
  if (address === 'ETH') {
    return address
  }
  return EthereumAddress(address)
}
