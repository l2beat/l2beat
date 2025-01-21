import type { ContractValue, ProxyDetails } from '@l2beat/discovery-types'
import { assert, Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { ethers } from 'ethers'

import { serializeResult } from '../../handlers/user/ConstructorArgsHandler'
import type { IProvider } from '../../provider/IProvider'
import { bytes32ToAddress } from '../../utils/address'
import { getPastUpgradesSingleEvent } from '../pastUpgrades'

export async function getOpticsBeaconProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const proxyConstructorFragment = ethers.utils.Fragment.from(
    'constructor(address _upgradeBeacon, bytes memory _initializationCalldata)',
  )
  const upgradeBeacon = await getAddressFromConstructor(
    provider,
    address,
    proxyConstructorFragment,
    0,
  )

  const beaconConstructorFragment = ethers.utils.Fragment.from(
    'constructor(address _initialImplementation, address _controller)',
  )
  const beaconController = await getAddressFromConstructor(
    provider,
    upgradeBeacon,
    beaconConstructorFragment,
    1,
  )

  const implementationCallResult = await provider.call(
    upgradeBeacon,
    Bytes.fromHex('0x'),
  )

  // TODO: (sz-piotr) what about reverts?
  const implementation = bytes32ToAddress(implementationCallResult)
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

async function getAddressFromConstructor(
  provider: IProvider,
  address: EthereumAddress,
  constructorFragment: ethers.utils.Fragment,
  index: number,
): Promise<EthereumAddress> {
  const { constructorArguments } = await provider.getSource(address)
  const decodedArgs = ethers.utils.defaultAbiCoder.decode(
    constructorFragment.inputs,
    '0x' + constructorArguments,
  )

  const args = serializeResult(decodedArgs)
  assert(Array.isArray(args), 'Constructor args are not an array')

  const arg = args[index]
  assert(arg !== undefined, 'Argument not found: ' + index.toString())
  assert(
    typeof arg === 'string',
    'Argument is not a string: ' + index.toString(),
  )

  return EthereumAddress(arg)
}
