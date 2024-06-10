import React from 'react'

import { LinkSectionLink } from '../../pages/project/components/LinkSectionLink'
import { ProjectLink } from '../../pages/project/types'
import { cn } from '../../utils/cn'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../Accordion'

interface MobileProjectLinksProps {
  projectLinks: ProjectLink[]
}

export function MobileProjectLinks(props: MobileProjectLinksProps) {
  return (
    <Accordion>
      <AccordionItem>
        <AccordionTrigger className="py-4">
          <span className="font-bold">Links:</span>
          <span className="ml-2 font-medium text-gray-600">
            Website, Docs, etc.
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <table className="w-full table-fixed border-collapse text-left text-xs">
            <tbody>
              {props.projectLinks.map(({ name, links }, i) => (
                <tr
                  className="border-gray-300 border-t dark:border-gray-850 first:border-none"
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
