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
/** A rule whose evaluate() throws — isolated by evaluatePromotion into ruleErrors. */
const throwingRule: PromotionRule = {
  name: 'brokenRule',
  evaluate: () => {
    throw new Error('kaboom')
  },
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

    it('enforce: does NOT notify when a manual verdict preserves the write (no-op)', async () => {
      // upsertAuto no-ops because a human already promoted/blocked this timestamp;
      // a fresh alert would contradict the stored verdict.
      const { service, statusRepository } = setup(
        'enforce',
        true,
        [blockingRule],
        false,
      )

      const result = await service.reconcile(ctx)

      expect(result.status).toEqual('blocked')
      expect(result.notify).toEqual(false)
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

    it('enforce + failClosed: blocks and surfaces a rule that throws', async () => {
      const { service, statusRepository } = setup('enforce', true, [
        throwingRule,
      ])

      const result = await service.reconcile(ctx)

      expect(result.status).toEqual('blocked')
      expect(result.notify).toEqual(true)
      expect(result.reasons).toHaveLength(1)
      expect(result.reasons[0]?.rule).toEqual('brokenRule')
      expect(result.reasons[0]?.message).toEqual(
        'rule "brokenRule" failed to evaluate: kaboom',
      )
      expect(statusRepository.upsertAuto).toHaveBeenCalledWith({
        timestamp: UnixTime(100),
        status: 'blocked',
        reasons: result.reasons,
      })
    })

    it('enforce + failClosed: surfaces both a throwing rule and a real violation', async () => {
      const { service } = setup('enforce', true, [throwingRule, blockingRule])

      const result = await service.reconcile(ctx)

      expect(result.status).toEqual('blocked')
      expect(result.reasons.map((r) => r.rule)).toEqual([
        'brokenRule',
        'maxTotalVolume',
      ])
    })

    it('enforce + failOpen: promotes despite a rule that throws', async () => {
      const { service, statusRepository } = setup('enforce', false, [
        throwingRule,
      ])

      const result = await service.reconcile(ctx)

      expect(result.status).toEqual('promoted')
      expect(result.notify).toEqual(false)
      expect(statusRepository.upsertAuto).toHaveBeenCalledWith({
        timestamp: UnixTime(100),
        status: 'promoted',
      })
    })

    it('shadow: promotes despite a rule that throws, never notifies', async () => {
      const { service, statusRepository } = setup('shadow', true, [
        throwingRule,
      ])

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
  /** Whether the sticky auto write applies; false ⇒ a manual verdict was preserved. */
  upsertAutoApplied = true,
) {
  const statusRepository = mockObject<Database['interopAggregateStatus']>({
    upsertAuto: mockFn().resolvesTo(upsertAutoApplied),
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
