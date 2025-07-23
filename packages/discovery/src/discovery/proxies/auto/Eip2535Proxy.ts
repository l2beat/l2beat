// EIP-2535: Diamonds, Multi-Facet Proxy
// https://eips.ethereum.org/EIPS/eip-2535#a-note-on-implementing-interfaces
// every contract implementing this standard needs to have facetAddresses() view function

import {
  assert,
  ChainSpecificAddress,
  type EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import type { ProxyDetails } from '../types'

async function getPastUpgrades(
  provider: IProvider,
  address: ChainSpecificAddress,
) {
  const abi = new utils.Interface([
    'event DiamondCut(tuple(address facet, uint8 action, bool isFreezable, bytes4[] selectors)[] facetCuts, address initAddress, bytes initCalldata)',
  ])
  const logs = await provider.getLogs(address, [
    [abi.getEventTopic('DiamondCut')],
  ])

  const blockNumbers = [...new Set(logs.map((l) => l.blockNumber))]
  const blocks = await Promise.all(
    blockNumbers.map(
      async (blockNumber) => await provider.getBlock(blockNumber),
    ),
  )
  assert(blocks.every((b) => b !== undefined))

  const dateMap = Object.fromEntries(
    blocks.map((b) => [b.number, UnixTime.toDate(b.timestamp).toISOString()]),
  )

  const selectorAddress: Map<string, string> = new Map()
  const ADD = 0
  const REPLACE = 1
  const REMOVE = 2

  return logs.map((l) => {
    const parsed = abi.parseLog(l)
    for (const cut of parsed.args.facetCuts) {
      switch (cut.action) {
        case ADD:
          {
            for (const selector of cut.selectors) {
              selectorAddress.set(
                selector,
                ChainSpecificAddress.fromLong(provider.chain, cut.facet),
              )
            }
          }
          break
        case REPLACE:
          {
            for (const selector of cut.selectors) {
              selectorAddress.set(
                selector,
                ChainSpecificAddress.fromLong(provider.chain, cut.facet),
              )
            }
          }
          break
        case REMOVE:
          {
            for (const selector of cut.selectors) {
              selectorAddress.delete(selector)
            }
          }
          break
      }
    }

    const implementations = [...new Set(selectorAddress.values())]
    return {
      date: dateMap[l.blockNumber] ?? 'ERROR',
      hash: Hash256(l.transactionHash),
      addresses: implementations,
    }
  })
}

export async function detectEip2535proxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const facets = await provider.callMethod<EthereumAddress[]>(
    address,
    'function facetAddresses() external view returns (address[] memory facetAd)',
    [],
  )

  if (facets === undefined) {
    return
  }

  const pastUpgrades = await getPastUpgrades(provider, address)

  return {
    type: 'EIP2535 diamond proxy',
    values: {
      // TODO: (sz-piotr) I'm not actually sure if this is correct. Diamonds actually have specific faucet that we should query for this.
      $immutable: false,
      $implementation: facets.map((f) =>
        ChainSpecificAddress.fromLong(provider.chain, f).toString(),
      ),
      $pastUpgrades: pastUpgrades.map((v) => [v.date, v.hash, v.addresses]),
      $upgradeCount: Object.values(pastUpgrades).length,
    },
  }
}
