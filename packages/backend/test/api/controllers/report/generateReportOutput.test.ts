import { UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { generateReportOutput } from '../../../../src/api/controllers/report/generateReportOutput'

describe(generateReportOutput.name, () => {
  const TODAY = UnixTime.fromDate(new Date('2022-05-05T00:00:00Z'))
  const USD = 1000_11n
  const ETH = 1_111111n
  const BALANCE = 1111111n

  it('converts to compatible interface', async () => {
    const entries = [
      {
        timestamp: TODAY.add(-1, 'days'),
        value: { usd: 4n * USD, eth: 4n * ETH },
        projects: new Map([
          [
            'Arbitrum',
            {
              value: { usd: 3n * USD, eth: 3n * ETH },
              tokens: new Map([
                [
                  'DAI',
                  {
                    usd: 2n * USD,
                    eth: 2n * ETH,
                    balance: 2n * BALANCE,
                    decimals: 4,
                  },
                ],
                [
                  'WETH',
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 6,
                  },
                ],
              ]),
            },
          ],
          [
            'Optimism',
            {
              value: { usd: USD, eth: ETH },
              tokens: new Map([
                [
                  'DAI',
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 4,
                  },
                ],
              ]),
            },
          ],
        ]),
      },
      {
        timestamp: TODAY,
        value: { usd: 4n * USD, eth: 4n * ETH },
        projects: new Map([
          [
            'Arbitrum',
            {
              value: { usd: 3n * USD, eth: 3n * ETH },
              tokens: new Map([
                [
                  'DAI',
                  {
                    usd: 2n * USD,
                    eth: 2n * ETH,
                    balance: 2n * BALANCE,
                    decimals: 4,
                  },
                ],
                [
                  'WETH',
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 6,
                  },
                ],
              ]),
            },
          ],
          [
            'Optimism',
            {
              value: { usd: USD, eth: ETH },
              tokens: new Map([
                [
                  'DAI',
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 4,
                  },
                ],
              ]),
            },
          ],
        ]),
      },
    ]

    const result = generateReportOutput(entries)

    expect(result).toEqual({
      aggregate: {
        types: ['date', 'usd', 'eth'],
        data: [
          ['2022-05-04', 4000.44, 4.444444],
          ['2022-05-05', 4000.44, 4.444444],
        ],
      },
      byProject: {
        ['Arbitrum']: {
          aggregate: {
            types: ['date', 'usd', 'eth'],
            data: [
              ['2022-05-04', 3000.33, 3.333333],
              ['2022-05-05', 3000.33, 3.333333],
            ],
          },
          byToken: {
            ['DAI']: {
              types: ['date', 'dai', 'usd'],
              data: [
                ['2022-05-04', 222.2222, 2000.22],
                ['2022-05-05', 222.2222, 2000.22],
              ],
            },
            ['WETH']: {
              types: ['date', 'weth', 'usd'],
              data: [
                ['2022-05-04', 1.111111, 1000.11],
                ['2022-05-05', 1.111111, 1000.11],
              ],
            },
          },
        },
        ['Optimism']: {
          aggregate: {
            types: ['date', 'usd', 'eth'],
            data: [
              ['2022-05-04', 1000.11, 1.111111],
              ['2022-05-05', 1000.11, 1.111111],
            ],
          },
          byToken: {
            ['DAI']: {
              types: ['date', 'dai', 'usd'],
              data: [
                ['2022-05-04', 111.1111, 1000.11],
                ['2022-05-05', 111.1111, 1000.11],
              ],
            },
          },
        },
      },
    })
  })
})
