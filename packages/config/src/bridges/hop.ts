import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const hop: Bridge = {
  id: ProjectId('hop'),
  name: 'Hop',
  slug: 'hop',
  validation: 'Liquidity Network',
  links: {
    websites: ['https://hop.exchange/'],
  },
  escrows: [
    {
      address: '0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a',
      sinceTimestamp: new UnixTime(1623907245),
      tokens: ['USDC'],
    },
    {
      address: '0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1',
      sinceTimestamp: new UnixTime(1631654328),
      tokens: ['DAI'],
    },
    {
      address: '0x3E4a3a4796d16c0Cd582C382691998f7c06420B6',
      sinceTimestamp: new UnixTime(1626739308),
      tokens: ['USDT'],
    },
    {
      address: '0xb8901acB165ed027E32754E0FFe830802919727f',
      sinceTimestamp: new UnixTime(1633066189),
      tokens: ['ETH'],
    },
    {
      address: '0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2',
      sinceTimestamp: new UnixTime(1628225875),
      tokens: ['MATIC'],
    },
    {
      address: '0xb98454270065A31D71Bf635F6F7Ee6A518dFb849',
      sinceTimestamp: new UnixTime(1635022634),
      tokens: ['WBTC'],
    },
  ],
  connections: [],
}
