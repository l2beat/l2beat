import React from 'react'

export function Banner() {
  return (
    <a
      className="block text-center bg-yellow-500 text-black text-xs font-bold px-4 py-1.5"
      href="/bridges/tvl"
    >
      We have just released L2BEAT Bridges!{' '}
      <span className="underline">Check it out!</span>
    </a>
  )
}
