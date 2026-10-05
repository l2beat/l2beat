import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { extractZkApiNote } from './extractZkApiNote'

describe(extractZkApiNote.name, () => {
  const abi = new utils.Interface([
    'event NoteDeposited(uint32 indexed noteId, bytes32 indexed commitment, uint128 amount, uint64 expiryTs, uint256 newRoot)',
    'event MutualClose(uint32 indexed noteId, uint256 nullifier, uint128 finalBalance, address destination)',
    'event EscapeWithdrawalInitiated(uint32 indexed noteId, uint256 nullifier, uint128 finalBalance, address destination, uint64 challengeDeadline, uint256 newRoot)',
    'event EscapeWithdrawalChallenged(uint32 indexed noteId, uint256 nullifier, uint256 restoredRoot)',
    'event EscapeWithdrawalFinalized(uint32 indexed noteId, uint256 nullifier, uint128 finalBalance, address destination)',
    'event ExpiredClaimed(uint32 indexed noteId, uint128 depositAmount, uint256 newRoot)',
  ])
  const destination = `0x${'11'.repeat(20)}`
  const noteId = 4_294_967_295
  const expiry = UnixTime(1_800_000_000)
  const cases = [
    {
      event: 'NoteDeposited',
      args: [noteId, `0x${'22'.repeat(32)}`, 50000, expiry, 1],
      active: true,
    },
    { event: 'MutualClose', args: [noteId, 1, 0, destination], active: false },
    {
      event: 'EscapeWithdrawalInitiated',
      args: [noteId, 1, 0, destination, expiry, 2],
      active: false,
    },
    { event: 'EscapeWithdrawalChallenged', args: [noteId, 1, 3], active: true },
    {
      event: 'EscapeWithdrawalFinalized',
      args: [noteId, 1, 0, destination],
      active: false,
    },
    { event: 'ExpiredClaimed', args: [noteId, 50000, 4], active: false },
  ]
  for (const { event, args, active } of cases) {
    it(`decodes ${event}`, () => {
      const log = abi.encodeEventLog(abi.getEvent(event), args)
      expect(
        extractZkApiNote({ ...log, address: destination }, '1000000000'),
      ).toEqual({
        amount: event === 'NoteDeposited' ? 50_000_000_000_000n : 0n,
        note: {
          id: noteId,
          active,
          expiresAt: event === 'NoteDeposited' ? expiry : null,
        },
      })
    })
  }
})
