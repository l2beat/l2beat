import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const stargate: Bridge = {
  id: ProjectId('stargate'),
  display: {
    name: 'StarGate',
    slug: 'stargate',
    links: {
      websites: ['https://stargate.finance/'],
    },
  },
  config: {
    // In StarkGate these are pools, there is a separate Pool contract for each supported token. The list of all the pools can be obtained
    // from the pool factory: 0x06d538690af257da524f25d0cd52fd85b1c2173e. For Ether pool (SGETH) there is additinal Escrow contract
    escrows: [
      {
        address: '0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56',
        sinceTimestamp: new UnixTime(1647511732),
        tokens: ['USDC'],
      },
      {
        address: '0x38EA452219524Bb87e18dE1C24D3bB59510BD783',
        sinceTimestamp: new UnixTime(1647511860),
        tokens: ['USDT'],
      },
      //   {
      //     address: '0x692953e758c3669290cb1677180c64183cEe374e',
      //     sinceTimestamp: new UnixTime(1656354769),
      //     tokens: ['USDD'],
      //   },
      {
        address: '0x72E2F4830b9E45d52F80aC08CB2bEC0FeF72eD9c',
        sinceTimestamp: new UnixTime(1656108257),
        tokens: ['ETH'],
      },
    ],
  },
  technology: {
    type: 'Lock-Mint OR Swap',
    validation: 'Liquidity Network',
    destination: ['TODO', 'TODO', 'TODO'],
    connections: [],
  },
}
