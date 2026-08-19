import { expect } from 'earl'
import { daTrackingDomain } from './daTracking/identities'
import {
  AI_GUARD_RAIL,
  gapMessage,
  rangeChangeMessage,
  removalMessage,
} from './messages'

describe('snapshot guard messages', () => {
  const domain = daTrackingDomain

  describe(removalMessage.name, () => {
    const message = removalMessage(domain, 'taiko', [
      {
        id: 'abc123',
        label: 'ethereum inbox 0x1 since 100',
        since: 100,
        until: 200,
      },
    ])

    it('names the project, the id and the range', () => {
      expect(message).toInclude('taiko')
      expect(message).toInclude('abc123')
      expect(message).toInclude('ethereum inbox 0x1 since 100')
      expect(message).toInclude('100 -> 200')
    })

    it('warns about the wipe and walks through the freeze recipe', () => {
      expect(message).toInclude(domain.wipeWarning)
      expect(message).toInclude(domain.freezeRecipe)
      expect(message).toInclude('untilBlock')
      expect(message).toInclude('usedBlockNumbers')
      expect(message).toInclude('pnpm snapshots:generate')
    })

    it('keeps the AI guard-rail line', () => {
      expect(message).toInclude(AI_GUARD_RAIL)
    })
  })

  describe(rangeChangeMessage.name, () => {
    const message = rangeChangeMessage(domain, 'taiko', [
      {
        id: 'abc123',
        label: 'ethereum inbox 0x1 since 100',
        old: { since: 100 },
        new: { since: 150 },
      },
    ])

    it('shows the old range next to the new one', () => {
      expect(message).toInclude('taiko')
      expect(message).toInclude('abc123')
      expect(message).toInclude('100 -> open => 150 -> open')
    })

    it('warns about the data loss and offers pin-or-accept', () => {
      expect(message).toInclude('DROPS')
      expect(message).toInclude(domain.rangeChangeRecipe)
      expect(message).toInclude('pin the range')
      expect(message).toInclude('If the move is intended')
    })

    it('does not tell the human to freeze and re-add, which would collide on the id', () => {
      expect(message).not.toInclude(domain.freezeRecipe)
      expect(message).toInclude('Do not freeze it and add a second entry')
    })

    it('keeps the AI guard-rail line', () => {
      expect(message).toInclude(AI_GUARD_RAIL)
    })
  })

  describe(gapMessage.name, () => {
    const message = gapMessage(domain, [
      {
        projectId: 'taiko',
        message: 'taiko is not tracked between 201 and 299',
      },
    ])

    it('lists the gap and forbids widening an existing range', () => {
      expect(message).toInclude('taiko is not tracked between 201 and 299')
      expect(message).toInclude('Do NOT widen an existing range')
      expect(message).toInclude('LEGACY_COVERAGE_GAPS')
      expect(message).toInclude(AI_GUARD_RAIL)
    })
  })
})
