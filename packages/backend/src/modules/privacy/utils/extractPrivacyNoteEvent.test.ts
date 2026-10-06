import type { PrivacyNoteSource } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { PrivacyNoteEvent } from '../types'
import { zkApiInterface } from '../zkapi/abi'
import {
  extractPrivacyNoteEvent,
  getPrivacyNoteExtractor,
} from './extractPrivacyNoteEvent'

describe(extractPrivacyNoteEvent.name, () => {
  describe('zkApiNote', () => {
    const source: PrivacyNoteSource = {
      extractor: 'zkApiNote',
      params: { weiPerUnit: '1000000000' },
    }
    const destination = `0x${'11'.repeat(20)}`
    // The largest uint32 proves ids are not truncated or sign-flipped.
    const noteId = 4_294_967_295
    const expiry = UnixTime(1_800_000_000)
    const cases: {
      event: string
      args: unknown[]
      expected: PrivacyNoteEvent
    }[] = [
      {
        event: 'NoteDeposited',
        args: [noteId, `0x${'22'.repeat(32)}`, 50_000, expiry, 1],
        // 50k vault units at 1 gwei per unit.
        expected: {
          type: 'deposit',
          noteId,
          amount: 50_000_000_000_000n,
          expiresAt: expiry,
        },
      },
      {
        event: 'MutualClose',
        args: [noteId, 1, 0, destination],
        expected: { type: 'statusChange', noteId, active: false },
      },
      {
        event: 'EscapeWithdrawalInitiated',
        args: [noteId, 1, 0, destination, expiry, 2],
        expected: { type: 'statusChange', noteId, active: false },
      },
      {
        event: 'EscapeWithdrawalChallenged',
        args: [noteId, 1, 3],
        expected: { type: 'statusChange', noteId, active: true },
      },
      {
        event: 'EscapeWithdrawalFinalized',
        args: [noteId, 1, 0, destination],
        expected: { type: 'statusChange', noteId, active: false },
      },
      {
        event: 'ExpiredClaimed',
        args: [noteId, 50_000, 4],
        expected: { type: 'statusChange', noteId, active: false },
      },
    ]

    for (const { event, args, expected } of cases) {
      it(`decodes ${event} into a ${expected.type} of the note`, () => {
        const log = zkApiInterface.encodeEventLog(
          zkApiInterface.getEvent(event),
          args,
        )

        expect(
          extractPrivacyNoteEvent(source, { ...log, address: destination }),
        ).toEqual(expected)
      })
    }

    it('covers exactly the topics of the events it decodes, so no lifecycle event is fetched but skipped', () => {
      expect(getPrivacyNoteExtractor(source).events).toEqualUnsorted(
        cases.map(({ event }) => zkApiInterface.getEventTopic(event)),
      )
    })
  })
})
