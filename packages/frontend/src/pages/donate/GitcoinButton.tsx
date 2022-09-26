import React from 'react'

import { config } from '../../build/config'
import { OutLink } from '../../components'

export function GitcoinButton() {
  if (!config.features.gitcoinOption) {
    return null
  }
  return (
    <OutLink
      className="GitcoinButton"
      href="https://gitcoin.co/grants/3857/l2beat"
    >
      Donate using Gitcoin
    </OutLink>
  )
}
