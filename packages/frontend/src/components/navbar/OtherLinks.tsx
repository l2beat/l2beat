import React from 'react'

import { OutLink } from '../OutLink'

export interface OtherLinksProps {
  forumLink: string
}

export function OtherLinks(props: OtherLinksProps) {
  return (
    <>
      <li>
        <OutLink href={props.forumLink}>Forum</OutLink>
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
