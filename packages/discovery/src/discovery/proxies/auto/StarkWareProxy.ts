import {
  Bytes,
  EthereumAddress,
  Hash256,
  ProxyDetails,
} from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../../utils/address'
import { getCallResult } from '../../utils/getCallResult'
import { getProxyGovernance } from './StarkWareProxyGovernance'

// keccak256("StarkWare2019.implemntation-slot")
const IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x177667240aeeea7e35eabe3a35e18306f336219e1386f7710a6bf8783f761b24',
)

async function getImplementation(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
) {
  return bytes32ToAddress(
    await provider.getStorage(address, IMPLEMENTATION_SLOT, blockNumber),
  )
}

// keccak256("'StarkWare2020.CallProxy.Implemntation.Slot'")
const CALL_IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x7184681641399eb4ad2fdb92114857ee6ff239f94ad635a1779978947b8843be',
)

async function getCallImplementation(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
) {
  const callImplementation = bytes32ToAddress(
    await provider.getStorage(address, CALL_IMPLEMENTATION_SLOT, blockNumber),
  )

  if (callImplementation === EthereumAddress.ZERO) return

  return callImplementation
}

// Web3.solidityKeccak(['string'], ['StarkWare.Upgradibility.Delay.Slot'])
const UPGRADE_DELAY_SLOT = Bytes.fromHex(
  '0xc21dbb3089fcb2c4f4c6a67854ab4db2b0f233ea4b21b21f912d52d18fc5db1f',
)

async function getUpgradeDelay(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
) {
  const value = await provider.getStorage(
    address,
    UPGRADE_DELAY_SLOT,
    blockNumber,
  )
  return BigNumber.from(value.toString()).toNumber()
}

// Web3.solidityKeccak(['string'], ["StarkWare2019.finalization-flag-slot"]).
const FINALIZED_STATE_SLOT = Bytes.fromHex(
  '0x7184681641399eb4ad2fdb92114857ee6ff239f94ad635a1779978947b8843be',
)

async function getFinalizedState(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
) {
  const stored = await provider.getStorage(
    address,
    FINALIZED_STATE_SLOT,
    blockNumber,
  )
  return !BigNumber.from(stored.toString()).eq(0)
}

export async function detectStarkWareProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const implementation = await getImplementation(provider, address, blockNumber)
  if (implementation === EthereumAddress.ZERO) {
    return
  }
  const [callImplementation, upgradeDelay, isFinal, proxyGovernance] =
    await Promise.all([
      getCallImplementation(provider, address, blockNumber),
      getUpgradeDelay(provider, address, blockNumber),
      getFinalizedState(provider, address, blockNumber),
      getProxyGovernance(provider, address, blockNumber),
    ])

  const diamond = await getStarkWareDiamond(
    provider,
    address,
    implementation,
    upgradeDelay,
    isFinal,
    proxyGovernance,
    blockNumber,
  )

  if (diamond) {
    return diamond
  }
  const relatives = callImplementation ? [callImplementation] : []
  relatives.push(...proxyGovernance)

  return {
    implementations: [implementation],
    relatives,
    upgradeability: {
      type: 'StarkWare proxy',
      implementation,
      callImplementation,
      upgradeDelay,
      isFinal,
      proxyGovernance,
    },
  }
}

const coder = new utils.Interface([
  'event Upgraded(address indexed implementation)',
  'event ImplementationUpgraded(address indexed implementation, bytes initializer)',
  'event ImplementationAdded(address indexed implementation, bytes initializer, bool finalize)',
])

// if returns false, it means that the proxy is not a StarkWare diamond
async function getStarkWareDiamond(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  implementation: EthereumAddress,
  upgradeDelay: number,
  isFinal: boolean,
  proxyGovernance: EthereumAddress[],
  blockNumber: number,
): Promise<ProxyDetails | false> {
  const upgrades = await provider.getLogs(
    address,
    [
      [
        coder.getEventTopic('Upgraded'),
        coder.getEventTopic('ImplementationUpgraded'),
      ],
    ],
    0,
    blockNumber,
  )

  const lastUpgrade = upgrades.at(-1)
  if (!lastUpgrade) {
    return false
  }

  let data: string | undefined

  try {
    const tx = await provider.getTransaction(
      Hash256(lastUpgrade.transactionHash),
    )

    const abi = new utils.Interface([
      'function upgradeTo(address newImplementation, bytes data, bool finalize)',
    ])

    data = abi.decodeFunctionData('upgradeTo', tx.data).data as string
  } catch (e) {
    if (
      !(e instanceof Error) ||
      !e.message.includes('data signature does not match function upgradeTo.')
    ) {
      throw e
    }
    console.log('Failed to decode upgradeTo data')

    if (lastUpgrade.topics[0] === coder.getEventTopic('Upgraded')) {
      // dydx uses the Upgraded event with governance
      // so we cannot get the info from their tx data
      // we need to find the ImplementationAdded event that holds the initializer
      console.log('Trying to find corresponding ImplementationAdded event')
      const implementationsAdded = await provider.getLogs(
        address,
        [coder.getEventTopic('ImplementationAdded')],
        0,
        blockNumber,
      )
      const correspondingImplementationAdded = implementationsAdded.find(
        (log) => {
          return log.topics[1] === lastUpgrade.topics[1]
        },
      )

      if (!correspondingImplementationAdded) {
        throw new Error(
          'Failed to find corresponding ImplementationAdded event',
        )
      }

      data = `0x${correspondingImplementationAdded.data.slice(194)}`
    } else {
      console.log('Falling back to decoding logs parameters')
      data = `0x${lastUpgrade.data.slice(130)}`
    }
  }

  // we subtract 2 for '0x' and 1 for an external initializer contract
  const maxAddresses = Math.floor((data.length - 2) / 64) - 1

  const facets: Record<string, EthereumAddress> = {}
  for (let i = 0; i < maxAddresses; i++) {
    const bytes32 = data.slice(2 + 64 * i, 2 + 64 * (i + 1))
    if (!bytes32.startsWith('0'.repeat(24))) {
      break
    }
    const facet = EthereumAddress('0x' + bytes32.slice(24))
    const name = await getCallResult<string>(
      provider,
      facet,
      'function identify() view returns (string)',
      [],
      blockNumber,
    )
    if (!name) {
      break
    }
    facets[name] = facet
  }

  if (Object.keys(facets).length <= 1) {
    // no facets found, this is not a StarkWare diamond
    // 1 facet is the implementation itself
    // and could mean that it's a callProxy
    return false
  }

  return {
    implementations: [implementation, ...Object.values(facets)],
    relatives: proxyGovernance,
    upgradeability: {
      type: 'StarkWare diamond',
      implementation,
      upgradeDelay,
      isFinal,
      facets,
      proxyGovernance,
    },
  }
}
