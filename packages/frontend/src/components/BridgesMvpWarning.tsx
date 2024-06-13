import React from 'react'
import { common } from '../build/config/common'
import { Link } from './Link'

export function BridgesMvpWarning() {
  return (
    <p className="my-4 rounded-lg bg-yellow-500 p-2 text-center font-medium text-base text-black">
      L2BEAT Bridges is a work in progress. You might find incomplete research
      or inconsistent naming. Join our{' '}
      <Link href={common.links.discord}>Discord</Link> to suggest improvements!
    </p>
  )
}
