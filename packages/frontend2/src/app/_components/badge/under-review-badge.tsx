import React from 'react'

export function UnderReviewBadge() {
  return (
    <span className="inline-block rounded bg-zinc-700 px-1.5 text-xs font-medium uppercase !leading-none text-yellow-200">
      <span className="relative top-[0.5px]">In review</span>
    </span>
  )
}
