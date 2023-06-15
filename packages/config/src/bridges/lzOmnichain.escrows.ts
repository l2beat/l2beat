import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { ProjectEscrow } from '../common'

export const OMNICHAN_ESCROWS: ProjectEscrow[] = [
  {
    address: EthereumAddress('0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6'),
    sinceTimestamp: new UnixTime(1647504559),
    tokens: ['STG'],
  },
  {
    address: EthereumAddress('0x4fa745fccc04555f2afa8874cd23961636cdf982'),
    sinceTimestamp: new UnixTime(1657699079),
    tokens: ['agEUR'],
  },
  {
    address: EthereumAddress('0x1A36E24D61BC1aDa68C21C2Da1aD53EaB8E03e55'),
    sinceTimestamp: new UnixTime(1663003197),
    tokens: ['BOBA'],
  },
  {
    address: EthereumAddress('0xb0003eb166654f7e57c0463f8d1a438eb238c490'),
    sinceTimestamp: new UnixTime(1661794745),
    tokens: ['BOBA'],
  },
  {
    address: EthereumAddress('0x6f537839714761388b6d7ed61bc09579d5da2f41'),
    sinceTimestamp: new UnixTime(1660932033),
    tokens: ['BOBA'],
  },
  {
    address: EthereumAddress('0xee381e476b4335b8584a2026f3e845edac2c69de'),
    sinceTimestamp: new UnixTime(1663802015),
    tokens: ['LINK'],
  },
  {
    address: EthereumAddress('0x4F52b41a778761bd2EEa5b7b7ed8cBDAA02cEF3E'),
    sinceTimestamp: new UnixTime(1665428735),
    tokens: ['USDC'],
  },
  {
    address: EthereumAddress('0xb5D4D94b82722EAFe067887a2FB596Bb37B3AAd2'),
    sinceTimestamp: new UnixTime(1669580819),
    tokens: ['MATIC'],
  },
  {
    address: EthereumAddress('0x07b6eb9d3be334098e5af77185344bb3a34e0017'),
    sinceTimestamp: new UnixTime(1669581635),
    tokens: ['CRV'],
  },
  {
    address: EthereumAddress('0xab6Ebe9472e2e4B6FE720Dad16701F32ab905CC6'),
    sinceTimestamp: new UnixTime(1666769735),
    tokens: ['WBTC'],
  },
  {
    address: EthereumAddress('0x242d6e16653b30c830c1918b5cc23d27253b2d26'),
    sinceTimestamp: new UnixTime(1669583471),
    tokens: ['UNI'],
  },
]
