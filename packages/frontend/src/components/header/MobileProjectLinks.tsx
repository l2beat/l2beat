import React from 'react'

import { LinkSectionLink } from '../../pages/project/components/LinkSectionLink'
import { ProjectLink } from '../../pages/project/types'
import { cn } from '../../utils/cn'
import { ChevronDownIcon } from '../icons'

interface MobileProjectLinksProps {
  projectLinks: ProjectLink[]
}

export function MobileProjectLinks(props: MobileProjectLinksProps) {
  return (
    <div data-role="dropdown">
      <label className="flex items-center justify-between py-4">
        <input
          type="checkbox"
          autoComplete="off"
          className="peer hidden"
          data-role="dropdown-button"
        />
        <div>
          <span className="font-bold">Links:</span>
          <span className="ml-2 font-medium text-gray-600">
            Website, Docs, etc.
          </span>
        </div>
        <ChevronDownIcon className="transition-transform duration-300 peer-checked:-rotate-180" />
      </label>
      <div className="hidden" data-role="dropdown-item">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <tbody>
            {props.projectLinks.map(({ name, links }, i) => (
              <tr
                className="border-t border-gray-300 first:border-none dark:border-gray-850"
                key={i}
              >
                <th
                  className={cn(
                    'w-[110px] py-3 align-top font-medium text-gray-500 dark:text-gray-550',
                    i === 0 && 'pt-0',
                  )}
                >
                  {name}
                </th>
                <td className={cn('py-3', i === 0 && 'pt-0')}>
                  {links.map((x, i) => (
                    <LinkSectionLink key={i} href={x} name={name} />
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
