import { assert } from '@l2beat/backend-tools'
import { ProxyDetails } from '@l2beat/discovery-types'
import { ethers } from 'ethers'

import { Bytes } from '../../../utils/Bytes'
import { EthereumAddress } from '../../../utils/EthereumAddress'
import { serializeResult } from '../../handlers/user/ConstructorArgsHandler'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../../utils/address'

export async function getOpticsBeaconProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
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
    blockNumber,
  )

  const implementation = bytes32ToAddress(implementationCallResult)

  return {
    upgradeability: {
      type: 'Optics Beacon proxy',
      upgradeBeacon,
      beaconController,
      implementation,
    },
    implementations: [implementation],
    relatives: [upgradeBeacon, beaconController],
  }
}

async function getAddressFromConstructor(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  constructorFragment: ethers.utils.Fragment,
  index: number,
): Promise<EthereumAddress> {
  const result = await provider.getConstructorArgs(address)
  const decodedArgs = ethers.utils.defaultAbiCoder.decode(
    constructorFragment.inputs,
    '0x' + result,
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
