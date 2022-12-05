import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'

export const HYPHEN_BRIDGE_NAME = 'hyphenBridge'

export async function discoverHyphenBridge(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    HYPHEN_BRIDGE_NAME,
    ['0x2A5c2568b10A0E826BfA892Cf21BA7218310180b'],
    {
      skipMethods: {
        '0xebaB24F13de55789eC1F3fFe99A285754e15F7b9': ['getSuppliedLiquidity'],
      },
    },
  )
}
