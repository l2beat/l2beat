import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'

export async function getProxyGovernance(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
) {
  const deployer = await provider.getDeployer(address)
  const fullGovernance = await getFullGovernance(
    provider,
    address,
    deployer,
    blockNumber,
  )

  // One contract emits same events for proxy and implementation governance
  // so we need to filter out the ones that are not proxy governors
  const isGovernorAll = await Promise.all(
    fullGovernance.map((governor) =>
      getCallResult(
        provider,
        address,
        'function proxyIsGovernor(address testGovernor) view returns (bool)',
        [governor],
        blockNumber,
      ),
    ),
  )
  const filteredGovernance = fullGovernance.filter((_, i) => isGovernorAll[i])
  return filteredGovernance.map((governor) => EthereumAddress(governor))
}

async function getFullGovernance(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  deployer: EthereumAddress,
  blockNumber: number,
): Promise<string[]> {
  const event = 'event LogNewGovernorAccepted(address acceptedGovernor)'
  const key = 'acceptedGovernor'

  const abi = new utils.Interface([event])
  const logs = await provider.getLogs(
    address,
    [[abi.getEventTopic(event.slice(6))]],
    0,
    blockNumber,
  )
  const values = new Set<string>()
  // As of 04.04.2023 deployer is always a governor
  // but sometimes the event is not emitted
  // in the constructor, so we add it manually
  values.add(deployer.toString())

  for (const log of logs) {
    const parsed = abi.parseLog(log)
    values.add(getString(parsed.args[key]))
  }
  return Array.from(values)
}

function getString(value: unknown): string {
  assert(typeof value === 'string', 'Governor is not a string')
  return value
}
