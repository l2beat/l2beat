import type { Project } from '@l2beat/config'
import type { EcosystemNativeToken } from '~/app/(side-nav)/ecosystems/_components/widgets/ecosystem-native-token'

export function getNativeToken(
  ecosystem: Project<'ecosystemConfig'>,
): EcosystemNativeToken {
  return {
    logo: 'https://assets.coingecko.com/coins/images/38043/standard/ZKTokenBlack.png',
    name: 'ZKsync',
    symbol: 'ZK',
    description: ecosystem.ecosystemConfig.nativeToken.description,
    data: {
      price: 100,
      marketCap: 1000000,
      amount: 1000000,
    },
  }
}
