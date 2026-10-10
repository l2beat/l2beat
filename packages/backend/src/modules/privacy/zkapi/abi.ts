import { utils } from 'ethers'

/**
 * Note deposits and the two payout events of the zkAPI vault. Leaves out
 * EscapeWithdrawalInitiated so parsing it throws: an initiated escape has not
 * paid out yet and must not count as a withdrawal.
 */
export const zkApiInterface = new utils.Interface([
  'event NoteDeposited(uint32 indexed noteId, bytes32 indexed commitment, uint128 amount, uint64 expiryTs, uint256 newRoot)',
  'event MutualClose(uint32 indexed noteId, uint256 nullifier, uint128 finalBalance, address destination)',
  'event EscapeWithdrawalFinalized(uint32 indexed noteId, uint256 nullifier, uint128 finalBalance, address destination)',
])
