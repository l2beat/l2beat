import React from 'react'

export function Banner() {
  return (
    <a
      className="block text-center bg-blue-500 text-black text-xs font-bold px-4 py-1.5"
      href="/scaling/activity"
    >
      Activity tracking for L2s is LIVE!{' '}
      <span className="underline">Check it out!</span>
    </a>
  )
}
