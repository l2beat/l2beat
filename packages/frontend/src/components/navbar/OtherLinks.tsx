import React from 'react'

import { config } from '../../build/config'
import { OutLink } from '../OutLink'

export function OtherLinks() {
  return (
    <>
      <li>
        <OutLink href={config.links.forum}>Forum</OutLink>
      </li>
      <li>
        <a href="/donate">Donate</a>
      </li>
      <li>
        <a href="/faq">FAQ</a>
      </li>
    </>
  )
}
