/** Ethereum makes at most one block per slot, one slot every 12 seconds */
export const SLOT_SECONDS = 12
/** When Ethereum's slot 0 began, in unix seconds */
const GENESIS_TIME = 1606824023

/** Slots since genesis, with how far into the current one, at `unixSeconds` */
export function slotProgressAt(unixSeconds: number): number {
  return (unixSeconds - GENESIS_TIME) / SLOT_SECONDS
}

/** The slot under way at `unixSeconds`, which is the slot of a block made then */
export function slotAt(unixSeconds: number): number {
  return Math.floor(slotProgressAt(unixSeconds))
}

export function slotStart(slot: number): number {
  return GENESIS_TIME + slot * SLOT_SECONDS
}
