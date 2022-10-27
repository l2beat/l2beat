import { providers } from 'ethers'

import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getHopBridgeParams } from './contracts/hopBridge'

export const HOP_NAME = 'hop'

export async function getHopParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: HOP_NAME,
    contracts: await Promise.all([
      getHopBridgeParams(provider, addresses.usdcBridge, 'USDC Bridge'),
      getHopBridgeParams(provider, addresses.usdtBridge, 'USDT Bridge'),
      getHopBridgeParams(provider, addresses.daiBridge, 'DAI Bridge'),
      getHopBridgeParams(provider, addresses.ethBridge, 'ETH Bridge'),
      getHopBridgeParams(provider, addresses.maticBridge, 'MATIC Bridge'),
      getHopBridgeParams(provider, addresses.wbtcBridge, 'WBTC Bridge'),
    ]),
  }
  return parameters
}

export async function discoverHop(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    HOP_NAME,
    [
      addresses.usdcBridge,
      addresses.daiBridge,
      addresses.usdtBridge,
      addresses.ethBridge,
      addresses.maticBridge,
      addresses.wbtcBridge,
    ],
    {
      skipAddresses: ['0x3e8640574aa764763291eD733672D3A105107ac5'],
      skipMethods: {
        '0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a': [
          'l1CanonicalToken',
          'chainBalance',
          'getChallengeAmountForTransferAmount',
          'getBondForTransferAmount',
          'crossDomainMessengerWrappers',
          'isChainIdPaused',
          'getTimeSlot',
        ],
        '0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1': [
          'l1CanonicalToken',
          'chainBalance',
          'getChallengeAmountForTransferAmount',
          'getBondForTransferAmount',
          'crossDomainMessengerWrappers',
          'isChainIdPaused',
          'getTimeSlot',
        ],
        '0x3E4a3a4796d16c0Cd582C382691998f7c06420B6': [
          'l1CanonicalToken',
          'chainBalance',
          'getChallengeAmountForTransferAmount',
          'getBondForTransferAmount',
          'crossDomainMessengerWrappers',
          'isChainIdPaused',
          'getTimeSlot',
        ],
        '0xb8901acB165ed027E32754E0FFe830802919727f': [
          'l1CanonicalToken',
          'chainBalance',
          'getChallengeAmountForTransferAmount',
          'getBondForTransferAmount',
          'crossDomainMessengerWrappers',
          'isChainIdPaused',
          'getTimeSlot',
        ],
        '0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2': [
          'l1CanonicalToken',
          'chainBalance',
          'getChallengeAmountForTransferAmount',
          'getBondForTransferAmount',
          'crossDomainMessengerWrappers',
          'isChainIdPaused',
          'getTimeSlot',
        ],
        '0xb98454270065A31D71Bf635F6F7Ee6A518dFb849': [
          'l1CanonicalToken',
          'chainBalance',
          'getChallengeAmountForTransferAmount',
          'getBondForTransferAmount',
          'crossDomainMessengerWrappers',
          'isChainIdPaused',
          'getTimeSlot',
        ],
        '0xe5A5F138005E19A3E6D0FE68b039397EeEf2322b': [
          'burnRequests',
          'mintRequests',
          'getMintRequest',
          'getBurnRequest',
        ],
      },
    },
  )
}
