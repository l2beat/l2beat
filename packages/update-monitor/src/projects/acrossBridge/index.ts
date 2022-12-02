import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'

export const ACROSS_BRIDGE_NAME = 'acrossBridge'

export async function discoverAcrossBridge(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    ACROSS_BRIDGE_NAME,
    ['0xc186fA914353c44b2E33eBE05f21846F1048bEda'],
    {
      skipMethods: {
        '0xc186fA914353c44b2E33eBE05f21846F1048bEda': ['crossChainContracts'],
        '0x592349F7DeDB2b75f9d4F194d4b7C16D82E507Dc': [
          'proposals',
          'getProposal',
        ],
        '0x226726Ac52e6e948D1B7eA9168F9Ff2E27DbcbB5': ['bondedProposals'],
      },
    },
  )
}
