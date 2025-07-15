import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { EtherscanLink } from '~/components/EtherscanLink'
import { CustomLink } from '~/components/link/CustomLink'
import { Markdown } from '~/components/markdown/Markdown'
import { externalLinks } from '~/consts/externalLinks'
import { ChevronIcon } from '~/icons/Chevron'
import type { ZkCatalogProjectDetails } from '../utils/getZkCatalogProjectDetails'
import { LastUsedCell } from './LastUsedCell'
import { SubVerifiersTable } from './SubVerifiersTable'
import { VerifiedCell } from './VerifiedCell'

interface Props {
  items: ZkCatalogProjectDetails['verifiers']
}

export function Verifiers(props: Props) {
  return (
    <Accordion type="multiple" asChild>
      <table className="w-full">
        <thead>
          <tr className="border-divider border-b align-bottom text-secondary">
            <th className="px-4 py-2 text-start font-medium text-xs uppercase">
              Name
            </th>
            <th className="hidden py-2 pr-4 text-start font-medium text-xs uppercase md:table-cell">
              Verifier
            </th>
            <th className="py-2 pr-4 text-start font-medium text-xs uppercase">
              Verification status
            </th>
            <th className="hidden py-2 pr-4 text-start font-medium text-xs uppercase md:table-cell">
              Last used
            </th>
            <th />
          </tr>
        </thead>
        {props.items.map((item) => (
          <AccordionItem
            key={`${item.contractAddress.toString()}-${+item.chainId}`}
            value={`${item.contractAddress.toString()}-${+item.chainId}`}
            asChild
          >
            <tbody
              className="border-divider border-b transition-colors last:border-none"
              key={item.contractAddress.toString()}
            >
              <AccordionHeader asChild>
                <AccordionTrigger asChild>
                  <tr className="group/trigger h-14 cursor-pointer">
                    <td className="px-4 font-medium text-base md:text-lg">
                      {item.name}
                    </td>
                    <td className="hidden pr-4 text-sm md:table-cell md:text-base">
                      <EtherscanLink
                        href={item.url}
                        address={item.contractAddress.toString()}
                      />
                    </td>
                    <td className="pr-4">
                      <VerifiedCell {...item} />
                    </td>
                    <td className="hidden pr-4 md:table-cell">
                      <LastUsedCell days={item.lastUsedDaysAgo} />
                    </td>
                    <td className="pr-4">
                      <ChevronIcon className="transition-transform duration-300 ease-out group-data-[state=open]/trigger:rotate-180" />
                    </td>
                  </tr>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent asChild>
                <tr>
                  <td
                    colSpan={100}
                    className="mt-1 space-y-5 px-4 pb-5 md:hidden"
                  >
                    {item.verified === 'no' ? (
                      <CustomLink
                        href={externalLinks.askForZkCatalogVerification}
                      >
                        Submit or ask for verification
                      </CustomLink>
                    ) : null}
                    {item.verified !== 'no' && item.performedBy ? (
                      <p>
                        Verification performed by{' '}
                        <CustomLink href={item.performedBy.link}>
                          {item.performedBy.name}
                        </CustomLink>
                      </p>
                    ) : null}
                    <div>
                      <p className="mb-2 font-medium text-secondary text-xs">
                        Verifier
                      </p>
                      <EtherscanLink
                        address={item.contractAddress.toString()}
                        className="break-all"
                      />
                    </div>
                    <div>
                      <p className="mb-2 font-medium text-secondary text-xs">
                        Last used
                      </p>
                      <LastUsedCell days={item.lastUsedDaysAgo} />
                    </div>
                    <div>
                      <p className="mb-2 font-medium text-secondary text-xs">
                        Description
                      </p>
                      <Markdown className="text-xs">
                        {item.description}
                      </Markdown>
                    </div>
                    <SubVerifiersTable
                      verifier={item}
                      className="w-[calc(100vw-64px)] md:w-[calc(100vw-176px)]"
                    />
                  </td>
                  <td
                    colSpan={100}
                    className="mt-1 hidden w-[90%] space-y-5 px-4 pb-5 md:table-cell"
                  >
                    <div>
                      <p className="mb-2 font-medium text-secondary text-xs">
                        Description
                      </p>
                      <Markdown className="font-medium text-xs text-zinc-900/80 dark:text-white/80">
                        {item.description}
                      </Markdown>
                    </div>
                    <SubVerifiersTable
                      verifier={item}
                      className="w-[calc(100vw-64px)] md:w-[calc(100vw-176px)]"
                    />
                  </td>
                </tr>
              </AccordionContent>
            </tbody>
          </AccordionItem>
        ))}
      </table>
    </Accordion>
  )
}
