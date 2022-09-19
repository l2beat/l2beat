import React from 'react'

import { config } from '../../pages/config'
import { OutLink } from '../OutLink'

export function OtherLinks() {
  return (
    <>
      <li>
        <OutLink href={config.forumLink}>Forum</OutLink>
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
