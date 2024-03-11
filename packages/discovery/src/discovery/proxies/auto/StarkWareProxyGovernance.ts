import { assert } from '@l2beat/backend-tools'
import { utils } from 'ethers'

import { EthereumAddress } from '../../../utils/EthereumAddress'
import { Semver } from '../../../utils/semver'
import { fetchAccessControl } from '../../handlers/user/AccessControlHandler'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'

export async function getProxyGovernance(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
  proxyVersion: Semver,
): Promise<EthereumAddress[]> {
  if (proxyVersion.major === 5) {
    return getProxyGovernanceV5(provider, address, blockNumber)
  } else if (proxyVersion.major <= 4) {
    return getProxyGovernanceV4Down(provider, address, blockNumber)
  } else {
    throw new Error('Unsupported proxy version')
  }
}

async function getProxyGovernanceV5(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<EthereumAddress[]> {
  // int.from_bytes(Web3.keccak(text="ROLE_UPGRADE_GOVERNOR"), "big") & MASK_250 .
  const UPGRADE_GOVERNOR_HASH =
    '0x0251e864ca2a080f55bce5da2452e8cfcafdbc951a3e7fff5023d558452ec228'
  const unnamedRoles = await fetchAccessControl(provider, address, blockNumber)

  return (
    unnamedRoles[UPGRADE_GOVERNOR_HASH]?.members.map((address) =>
      EthereumAddress(address),
    ) ?? []
  )
}

async function getProxyGovernanceV4Down(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<EthereumAddress[]> {
  const deployer = await provider.getDeployer(address)
  if (!deployer) {
    throw new Error('Unable to fetch deployer for StarkWare Proxy governance')
  }

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
