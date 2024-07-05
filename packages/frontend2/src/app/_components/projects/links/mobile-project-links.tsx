import { cn } from '~/utils/cn'
import { type ProjectLink } from './types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/app/_components/accordion'
import { CustomLink } from '../../custom-link'
import { formatLink } from '~/utils/format-link'

export function MobileProjectLinks({
  projectLinks,
}: { projectLinks: ProjectLink[] }) {
  return (
    <Accordion type="single" collapsible={true}>
      <AccordionItem value="links">
        <AccordionTrigger className="py-4">
          <span className="font-bold">
            Links:{' '}
            <span className="ml-2 font-medium text-gray-600">
              Website, Docs, etc.
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <table className="w-full table-fixed border-collapse text-left text-xs">
            <tbody>
              {projectLinks.map(({ name, links }, i) => (
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
                    {links.map((link, i) => (
                      <CustomLink
                        className="block truncate"
                        href={link}
                        key={i}
                      >
                        {formatLink(link)}
                      </CustomLink>
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
