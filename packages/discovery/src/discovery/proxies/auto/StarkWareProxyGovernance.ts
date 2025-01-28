import { assert, EthereumAddress } from '@l2beat/shared-pure'

import type { Semver } from '../../../utils/semver'
import { fetchAccessControl } from '../../handlers/user/AccessControlHandler'
import type { IProvider } from '../../provider/IProvider'

export async function getProxyGovernance(
  provider: IProvider,
  address: EthereumAddress,

  proxyVersion: Semver,
): Promise<EthereumAddress[]> {
  if (proxyVersion.major === 5) {
    return await getProxyGovernanceV5(provider, address)
  } else if (proxyVersion.major <= 4) {
    return await getProxyGovernanceV4Down(provider, address)
  } else {
    throw new Error('Unsupported proxy version')
  }
}

async function getProxyGovernanceV5(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress[]> {
  // int.from_bytes(Web3.keccak(text="ROLE_UPGRADE_GOVERNOR"), "big") & MASK_250 .
  const UPGRADE_GOVERNOR_HASH =
    '0x0251e864ca2a080f55bce5da2452e8cfcafdbc951a3e7fff5023d558452ec228'
  const unnamedRoles = await fetchAccessControl(provider, address)

  return (
    unnamedRoles[UPGRADE_GOVERNOR_HASH]?.members.map((address) =>
      EthereumAddress(address),
    ) ?? []
  )
}

async function getProxyGovernanceV4Down(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress[]> {
  const deployment = await provider.getDeployment(address)
  if (!deployment) {
    throw new Error('Unable to fetch deployer for StarkWare Proxy governance')
  }

  const fullGovernance = await getFullGovernance(
    provider,
    address,
    deployment.deployer,
  )

  // One contract emits same events for proxy and implementation governance
  // so we need to filter out the ones that are not proxy governors
  const isGovernorAll = await Promise.all(
    fullGovernance.map((governor) =>
      provider.callMethod<boolean>(
        address,
        'function proxyIsGovernor(address testGovernor) view returns (bool)',
        [governor],
      ),
    ),
  )
  return fullGovernance
    .filter((_, i) => isGovernorAll[i])
    .map((governor) => EthereumAddress(governor))
}

async function getFullGovernance(
  provider: IProvider,
  address: EthereumAddress,
  deployer: EthereumAddress,
): Promise<string[]> {
  const events = await provider.getEvents(
    address,
    'event LogNewGovernorAccepted(address acceptedGovernor)',
    [],
  )
  const values = new Set<string>()
  // As of 04.04.2023 deployer is always a governor
  // but sometimes the event is not emitted
  // in the constructor, so we add it manually
  values.add(deployer.toString())

  for (const { event } of events) {
    values.add(getString(event['acceptedGovernor']))
  }
  return Array.from(values)
}

function getString(value: unknown): string {
  assert(typeof value === 'string', 'Governor is not a string')
  return value
}
