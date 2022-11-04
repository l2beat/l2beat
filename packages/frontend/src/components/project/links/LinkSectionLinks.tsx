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
    <tr className="border-t-[1px] first:border-none md:first:border-solid border-gray-300 dark:border-gray-850 md:dark:border-gray-650 md:px-6 ">
      <th className="font-medium text-gray-500 dark:text-gray-550 w-[110px] md:w-36 align-top py-3 md:pl-6">
        {name}
      </th>
      <td className="py-3 md:pr-6">
        {links.map((x, i) => (
          <LinkSectionLink key={i} href={x} social={social} />
        ))}
      </td>
    </tr>
  )
}
