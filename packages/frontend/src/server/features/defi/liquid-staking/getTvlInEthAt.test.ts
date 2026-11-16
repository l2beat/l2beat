import { ProjectService } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
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
  it("is the only token each liquid staking project's TVL counts", async () => {
    const projects = await new ProjectService().getProjects({
      select: ['liquidStaking'],
      optional: ['tvsConfig'],
    })

    for (const project of projects) {
      expect(project.tvsConfig?.map((token) => token.id.toString())).toEqual([
        getTvlToken(project).id,
      ])
    }
  })
})
