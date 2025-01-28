import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { TokenId, type TvsConfig } from '../types'

export const bobConfig: TvsConfig = {
  projectId: ProjectId('bob'),
  tokens: [
    {
      id: TokenId('bob-0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3'),
      ticker: 'WBTC',
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      // overall amount of WBTC
      amount: {
        type: 'totalSupply',
        address: EthereumAddress('0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3'),
        chain: 'bob',
        decimals: 8,
      },
      // overall amount of WBTC - amount of WBTC locked in escrow to mint SolvBTC
      valueForProject: {
        type: 'calculation',
        operator: 'diff',
        arguments: [
          {
            type: 'value',
            ticker: 'WBTC',
            amount: {
              type: 'totalSupply',
              address: EthereumAddress(
                '0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3',
              ),
              chain: 'bob',
              decimals: 8,
            },
          },
          {
            type: 'value',
            ticker: 'WBTC',
            amount: {
              type: 'balanceOfEscrow',
              address: EthereumAddress(
                '0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3',
              ),
              chain: 'bob',
              decimals: 8,
              escrowAddress: EthereumAddress(
                '0x33b7A7a164B77433A61d4B49bD780a2718812e6e',
              ),
            },
          },
        ],
      },
      sinceTimestamp: new UnixTime(1719475619),
      category: 'other',
      source: 'canonical',
      isAssociated: false,
    },
    {
      id: TokenId('bob-0x541FD749419CA806a8bc7da8ac23D346f2dF8B77'),
      ticker: 'SolvBTC',
      symbol: 'SolvBTC',
      name: 'Solv BTC',
      // overall amount of SolvBTC
      amount: {
        type: 'totalSupply',
        address: EthereumAddress('0x541FD749419CA806a8bc7da8ac23D346f2dF8B77'),
        chain: 'bob',
        decimals: 18,
      },
      // overall amount of SolvBTC - amount of SolvBTC locked in escrow to mint SolvBTC.BBN
      valueForProject: {
        type: 'calculation',
        operator: 'diff',
        arguments: [
          {
            type: 'value',
            ticker: 'SolvBTC',
            amount: {
              type: 'totalSupply',
              address: EthereumAddress(
                '0x541FD749419CA806a8bc7da8ac23D346f2dF8B77',
              ),
              chain: 'bob',
              decimals: 18,
            },
          },
          {
            type: 'value',
            ticker: 'SolvBTC',
            amount: {
              type: 'balanceOfEscrow',
              address: EthereumAddress(
                '0x541FD749419CA806a8bc7da8ac23D346f2dF8B77',
              ),
              chain: 'bob',
              decimals: 18,
              escrowAddress: EthereumAddress(
                '0x742779748Dc07943E97c2cf30B48A57b96E033e1',
              ),
            },
          },
        ],
      },
      sinceTimestamp: new UnixTime(1719475619),
      category: 'other',
      source: 'external',
      isAssociated: false,
    },
    {
      id: TokenId('bob-0xCC0966D8418d412c599A6421b760a847eB169A8c'),
      ticker: 'SolvBTC.BBN',
      symbol: 'SolvBTC.BBN',
      name: 'SolvBTC Babylon',
      // overall amount of SolvBTC.BBN"
      amount: {
        type: 'totalSupply',
        address: EthereumAddress('0xCC0966D8418d412c599A6421b760a847eB169A8c'),
        chain: 'bob',
        decimals: 18,
      },
      sinceTimestamp: new UnixTime(1722556800),
      category: 'other',
      source: 'external',
      isAssociated: false,
    },
  ],
}
