import React from 'react'

export function FinalityWarning() {
  return (
    <p className="my-4 rounded-lg bg-yellow-500 p-2 text-center text-xs font-medium text-black">
      Please note, the values on the page reflect the time required to achieve
      ordering finality, at which point transactions cannot be reverted or
      reordered. <br /> The actionable settlement time for these transactions
      may be longer.
    </p>
  )
}
