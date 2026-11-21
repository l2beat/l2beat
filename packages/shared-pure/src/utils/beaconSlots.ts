export const SLOT_SECONDS = 12
const GENESIS_TIME = 1606824023

export function slotProgressAt(unixSeconds: number): number {
  return (unixSeconds - GENESIS_TIME) / SLOT_SECONDS
}

export function slotAt(unixSeconds: number): number {
  return Math.floor(slotProgressAt(unixSeconds))
}

export function slotStart(slot: number): number {
  return GENESIS_TIME + slot * SLOT_SECONDS
}
