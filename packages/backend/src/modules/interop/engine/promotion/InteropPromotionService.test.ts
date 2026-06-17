import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import {
  InteropPromotionService,
  type PromotionMode,
} from './InteropPromotionService'
import type { PromotionContext, PromotionRule } from './types'

const ctx: PromotionContext = {
  timestamp: UnixTime(100),
  transfers: [],
  tokens: [],
}

const blockingRule: PromotionRule = {
  name: 'maxLaneVolume',
  evaluate: () => [
    {
      rule: 'maxTotalVolume',
      scope: '*',
      value: 9,
      threshold: 1,
      message: 'too big',
    },
  ],
}
const passingRule: PromotionRule = {
  name: 'maxLaneVolume',
  evaluate: () => [],
}

describe(InteropPromotionService.name, () => {
  describe(InteropPromotionService.prototype.reconcile.name, () => {
    it('off: always promotes without evaluating', async () => {
      const { service, statusRepository } = setup('off', true, [blockingRule])

      const result = await service.reconcile(ctx)

      expect(result).toEqual({ status: 'promoted', reasons: [], notify: false })
      expect(statusRepository.upsertAuto).toHaveBeenCalledWith({
        timestamp: UnixTime(100),
        status: 'promoted',
      })
    })

    it('shadow: promotes even when a rule fires, never notifies', async () => {
      const { service, statusRepository } = setup('shadow', true, [
        blockingRule,
      ])

      const result = await service.reconcile(ctx)

      expect(result.status).toEqual('promoted')
      expect(result.notify).toEqual(false)
      expect(statusRepository.upsertAuto).toHaveBeenCalledWith({
        timestamp: UnixTime(100),
        status: 'promoted',
      })
    })

    it('enforce: blocks and notifies when a rule fires', async () => {
      const { service, statusRepository } = setup('enforce', true, [
        blockingRule,
      ])

      const result = await service.reconcile(ctx)

      expect(result.status).toEqual('blocked')
      expect(result.notify).toEqual(true)
      expect(result.reasons).toHaveLength(1)
      expect(statusRepository.upsertAuto).toHaveBeenCalledWith({
        timestamp: UnixTime(100),
        status: 'blocked',
        reasons: result.reasons,
      })
    })

    it('enforce: promotes when no rule fires', async () => {
      const { service, statusRepository } = setup('enforce', true, [
        passingRule,
      ])

      const result = await service.reconcile(ctx)

      expect(result).toEqual({ status: 'promoted', reasons: [], notify: false })
      expect(statusRepository.upsertAuto).toHaveBeenCalledWith({
        timestamp: UnixTime(100),
        status: 'promoted',
      })
    })

    it('enforce + failClosed: blocks on an engine-level error', async () => {
      const { service, statusRepository } = setup(
        'enforce',
        true,
        brokenRules(),
      )

      const result = await service.reconcile(ctx)

      expect(result.status).toEqual('blocked')
      expect(result.notify).toEqual(true)
      expect(result.reasons[0]?.rule).toEqual('engineError')
      expect(statusRepository.upsertAuto).toHaveBeenCalledWith({
        timestamp: UnixTime(100),
        status: 'blocked',
        reasons: result.reasons,
      })
    })

    it('enforce + failOpen: promotes on an engine-level error', async () => {
      const { service, statusRepository } = setup(
        'enforce',
        false,
        brokenRules(),
      )

      const result = await service.reconcile(ctx)

      expect(result.status).toEqual('promoted')
      expect(result.notify).toEqual(false)
      expect(statusRepository.upsertAuto).toHaveBeenCalledWith({
        timestamp: UnixTime(100),
        status: 'promoted',
      })
    })
  })
})

function setup(
  mode: PromotionMode,
  failClosed: boolean,
  rules: PromotionRule[],
) {
  const statusRepository = mockObject<Database['interopAggregateStatus']>({
    upsertAuto: mockFn().resolvesTo(undefined),
  })
  const service = new InteropPromotionService({
    statusRepository,
    rules,
    mode,
    failClosed,
    logger: Logger.SILENT,
  })
  return { service, statusRepository }
}

/** Non-iterable "rules" so the evaluation itself throws (engine-level error). */
function brokenRules(): PromotionRule[] {
  return {
    [Symbol.iterator]() {
      throw new Error('boom')
    },
  } as unknown as PromotionRule[]
}
