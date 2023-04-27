import React from 'react'

import { ProjectLink } from '../../icons'
import { LinkSectionLink } from './LinkSectionLink'

interface Props {
  name: ProjectLink['name']
  links: string[]
}

export function LinkSectionLinks({ name, links }: Props) {
  if (links.length === 0) {
    return null
  }
  return (
    <tr className="border-t-[1px] border-gray-300 first:border-none dark:border-gray-850 md:px-6 md:first:border-solid md:dark:border-gray-650 ">
      <th className="w-[110px] py-3 align-top font-medium text-gray-500 dark:text-gray-550 md:w-36 md:pl-6">
        {name}
      </th>
      <td className="py-3 md:pr-6">
        {links.map((x, i) => (
          <LinkSectionLink key={i} href={x} name={name} />
        ))}
      </td>
    </tr>
  )
}
