import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { bytes32ToAddress } from '../../utils/address'
import { getPastUpgradesSingleEvent } from '../pastUpgrades'
import type { ProxyDetails } from '../types'

export async function getOpticsBeaconProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  // NOTE(radomski): These offsets are extracted manually from the runtime
  // bytecode. The only other way to extract these addresses is to look into
  // the constructor arguments. But this is super flaky, Etherscan gets lost
  // easily. The following where observed:
  //
  // - If enough time passes (3+ years), Etherscan will start to hallucinate
  // and will not provide a correct answer to certain API calls. - If
  // contract is semi-verified - that means a different contract which has
  // the same bytecode was verified - it might return constructor arguments
  // from that verified contract and not the one we queried.
  //
  // Because of these issues which brought a lot of confusion and instability
  // a decision was made to extract these addresses basically manually.
  const beaconBytecode = await provider.getBytecode(address)
  const upgradeBeacon = ChainSpecificAddress.fromLong(
    provider.chain,
    beaconBytecode.slice(66, 86).toString(),
  )

  const upgradeBeaconBytecode = await provider.getBytecode(upgradeBeacon)
  const beaconController = ChainSpecificAddress.fromLong(
    provider.chain,
    upgradeBeaconBytecode.slice(40, 60).toString(),
  )

  const implementationCallResult = await provider.call(
    upgradeBeacon,
    Bytes.fromHex('0x'),
  )

  // TODO: (sz-piotr) what about reverts?
  const implementation = ChainSpecificAddress.fromLong(
    provider.chain,
    bytes32ToAddress(implementationCallResult),
  )
  const pastUpgrades = await getPastUpgradesSingleEvent(
    provider,
    upgradeBeacon,
    'event Upgrade(address indexed implementation)',
  )

  return {
    type: 'Optics Beacon proxy',
    values: {
      $admin: beaconController.toString(),
      $implementation: implementation.toString(),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
      OpticsBeacon_beacon: upgradeBeacon.toString(),
    },
  }
}
