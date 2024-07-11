import React from 'react'

export function UnderReviewBadge() {
  return (
    <span className="!leading-none inline-block rounded px-1.5 font-medium uppercase bg-zinc-700 text-yellow-200 text-xs">
      <span className="relative top-[0.5px]">In review</span>
    </span>
  )
}
