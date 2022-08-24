import React from 'react'

import { config } from '../../pages/config'
import { OutLink } from '../OutLink'

export function OtherLinks() {
  return (
    <>
      <li>
        <OutLink className="font-bold" href={config.forumLink}>
          Forum
        </OutLink>
      </li>
      <li>
        <a className="font-bold" href="/donate">
          Donate
        </a>
      </li>
      <li>
        <a className="font-bold" href="/faq">
          FAQ
        </a>
      </li>
    </>
  )
}
