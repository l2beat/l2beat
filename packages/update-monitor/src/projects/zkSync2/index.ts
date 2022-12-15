import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { addresses } from './constants'

export const ZK_SYNC2_NAME = 'zkSync2'

export async function discoverZkSync2(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    ZK_SYNC2_NAME,
    [addresses.zkSync, addresses.bridge],
    {
      skipMethods: {
        '0x324000e0c256b806548b307af600afff3d000324': [
          'tokenURI',
          'getCreatorFingerprint',
          'getSerialId',
          'getContentHash',
          'getCreatorAccountId',
          'getCreatorAddress',
          'tokenByIndex',
          'getApproved',
          'ownerOf',
        ],
      },
    },
  )
}
