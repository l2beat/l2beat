import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/core/accordion'
import { ProductIcon } from '~/icons/products/SocialIcon'
import { cn } from '~/utils/cn'
import { formatLink } from '~/utils/format-link'
import { CustomLink } from '../../link/custom-link'
import { parseSocial } from './parse-social'
import { type ProjectLink } from './types'

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
                    {links.map((link) => {
                      if (name === 'Social') {
                        const parsed = parseSocial(link)
                        return (
                          <CustomLink
                            key={link}
                            className="mt-1 flex items-center gap-1.5 first:mt-0"
                            href={link}
                          >
                            {parsed.platform ? (
                              <ProductIcon
                                className="size-[1em] shrink-0 fill-current"
                                product={parsed.platform}
                              />
                            ) : null}
                            <span className="truncate">{parsed.text}</span>
                          </CustomLink>
                        )
                      }
                      return (
                        <CustomLink
                          key={link}
                          className="block truncate"
                          href={link}
                        >
                          {formatLink(link)}
                        </CustomLink>
                      )
                    })}
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
