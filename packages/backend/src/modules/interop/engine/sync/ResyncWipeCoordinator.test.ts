import { Logger } from '@l2beat/backend-tools'
import type { LongChainName } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import { ResyncWipeCoordinator } from './ResyncWipeCoordinator'

const CHAINS = ['ethereum', 'arbitrum'] as LongChainName[]

describe(ResyncWipeCoordinator.name, () => {
  it('waits until all chains are ready before wiping', async () => {
    const wipe = mockFn().resolvesTo(undefined)
    const coordinator = new ResyncWipeCoordinator(
      'cluster',
      CHAINS,
      Logger.SILENT,
    )

    const requestId = UnixTime(100)
    const first = await coordinator.waitForWipe({
      requestId,
      chain: 'ethereum',
      wipe,
    })
    const second = await coordinator.waitForWipe({
      requestId,
      chain: 'arbitrum',
      wipe,
    })
    const third = await coordinator.waitForWipe({
      requestId,
      chain: 'ethereum',
      wipe,
    })

    expect(first).toEqual(false)
    expect(second).toEqual(true)
    expect(third).toEqual(true)
    expect(wipe).toHaveBeenCalledTimes(1)
  })

  it('requires all chains again for a newer request', async () => {
    const wipe = mockFn().resolvesTo(undefined)
    const coordinator = new ResyncWipeCoordinator(
      'cluster',
      CHAINS,
      Logger.SILENT,
    )

    const firstRequest = UnixTime(100)
    await coordinator.waitForWipe({
      requestId: firstRequest,
      chain: 'ethereum',
      wipe,
    })
    await coordinator.waitForWipe({
      requestId: firstRequest,
      chain: 'arbitrum',
      wipe,
    })

    const secondRequest = UnixTime(200)
    const first = await coordinator.waitForWipe({
      requestId: secondRequest,
      chain: 'ethereum',
      wipe,
    })
    const second = await coordinator.waitForWipe({
      requestId: secondRequest,
      chain: 'arbitrum',
      wipe,
    })

    expect(first).toEqual(false)
    expect(second).toEqual(true)
    expect(wipe).toHaveBeenCalledTimes(2)
  })

  it('ignores stale requests', async () => {
    const wipe = mockFn().resolvesTo(undefined)
    const coordinator = new ResyncWipeCoordinator(
      'cluster',
      CHAINS,
      Logger.SILENT,
    )

    await coordinator.waitForWipe({
      requestId: UnixTime(200),
      chain: 'ethereum',
      wipe,
    })
    const stale = await coordinator.waitForWipe({
      requestId: UnixTime(100),
      chain: 'arbitrum',
      wipe,
    })

    expect(stale).toEqual(false)
    expect(wipe).toHaveBeenCalledTimes(0)
  })
})
