import { ProjectService } from '@l2beat/config'
import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { computeTvlInEth, getTvlToken } from './getTvlInEthAt'

describe(computeTvlInEth.name, () => {
  const DAY = UnixTime.DAY

  it('counts a rebasing token at one ETH', () => {
    const result = computeTvlInEth(
      [DAY],
      { id: 'lido-stETH', rebasing: true },
      [{ timestamp: DAY, tokenId: 'lido-stETH', amount: 100 }],
      [],
    )

    expect(result).toEqual([100])
  })

  it('values other tokens at the latest rate, within two days', () => {
    const result = computeTvlInEth(
      [DAY, 2 * DAY, 4 * DAY],
      { id: 'rocketpool-rETH', rebasing: false },
      [DAY, 2 * DAY, 4 * DAY].map((timestamp) => ({
        timestamp,
        tokenId: 'rocketpool-rETH',
        amount: 100,
      })),
      [{ timestamp: DAY, exchangeRate: 1_200_000_000_000_000_000n }],
    )

    expect(result).toEqual([120, 120, null])
  })

  it('treats a zero rate as a bad read', () => {
    const result = computeTvlInEth(
      [DAY],
      { id: 'rocketpool-rETH', rebasing: false },
      [{ timestamp: DAY, tokenId: 'rocketpool-rETH', amount: 100 }],
      [{ timestamp: DAY, exchangeRate: 0n }],
    )

    expect(result).toEqual([null])
  })

  it('gives null where the TVL counts another token', () => {
    const result = computeTvlInEth(
      [DAY, 2 * DAY],
      { id: 'lido-stETH', rebasing: true },
      [
        { timestamp: DAY, tokenId: 'lido-stETH', amount: 100 },
        { timestamp: 2 * DAY, tokenId: 'lido-stETH', amount: 100 },
        { timestamp: 2 * DAY, tokenId: 'lido-wstETH', amount: 50 },
      ],
      [],
    )

    expect(result).toEqual([100, null])
  })
})

describe(getTvlToken.name, () => {
  it("is a rate-tracked protocol's configured token, and none untracked", () => {
    const address = ChainSpecificAddress(
      'eth:0x0000000000000000000000000000000000000001',
    )
    expect(
      getTvlToken({
        id: ProjectId('xeth'),
        liquidStaking: {
          tracking: {
            contracts: {
              type: 'rate',
              token: address,
              symbol: 'xETH',
              rate: {
                address,
                method: 'function getRate() view returns (uint256)',
              },
            },
            marketQuotes: [],
          },
        },
      }),
    ).toEqual({ id: 'xeth-xETH', rebasing: false })
    expect(getTvlToken({ id: ProjectId('xeth'), liquidStaking: {} })).toEqual(
      undefined,
    )
  })

  it("is the only token each liquid staking project's TVL counts", async () => {
    const projects = await new ProjectService().getProjects({
      select: ['liquidStaking'],
      optional: ['tvsConfig'],
    })

    for (const project of projects) {
      const token = getTvlToken(project)
      // Untracked, or with TVL from DeFiLlama.
      if (!token || !project.tvsConfig) continue
      expect(project.tvsConfig.map((token) => token.id.toString())).toEqual([
        token.id,
      ])
    }
  })
})
