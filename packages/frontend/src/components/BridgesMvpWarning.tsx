import React from 'react'
import { common } from '../build/config/common'

export function BridgesMvpWarning() {
  return (
    <p className="my-4 rounded-lg bg-yellow-500 p-2 text-center font-medium text-base text-black">
      L2BEAT Bridges is a work in progress. You might find incomplete research
      or inconsistent naming. Join our{' '}
      <a
        className="font-medium underline"
        href={common.links.discord}
        target="_blank"
      >
        Discord
      </a>{' '}
      to suggest improvements!
    </p>
  )
}
