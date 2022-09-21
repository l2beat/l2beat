import React from 'react'

import { LinkSectionLink } from './LinkSectionLink'

interface Props {
  name: string
  links: string[]
  social?: boolean
}

export function LinkSectionLinks({ name, links, social }: Props) {
  if (links.length === 0) {
    return null
  }
  return (
    <tr>
      <th>{name}</th>
      <td>
        {links.map((x, i) => (
          <LinkSectionLink key={i} href={x} social={social} />
        ))}
      </td>
    </tr>
  )
}
