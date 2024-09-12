import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { OutLink } from '~/components/out-link'
import { EM_DASH } from '~/consts/characters'
import { InfoIcon } from '~/icons/info'
import { cn } from '~/utils/cn'
import { type ZkCatalogProjectDetails } from './zk-catalog-project-page'

interface Props {
  verifier: ZkCatalogProjectDetails['verifiers'][number]
  className?: string
}

export function SubVerifiersTable({ verifier, className }: Props) {
  return (
    <div
      className={cn(
        'overflow-x-auto whitespace-pre pb-1.5 lg:w-full',
        className,
      )}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-left align-bottom dark:border-zinc-700">
            <th className="py-1.5 pr-3 text-2xs font-semibold uppercase text-gray-500 dark:text-gray-50">
              Name
            </th>
            <th className="py-1.5 pr-3 text-2xs font-semibold uppercase text-gray-500 dark:text-gray-50">
              Proof system
            </th>
            <th className="py-1.5 pr-3 text-2xs font-semibold uppercase text-gray-500 dark:text-gray-50">
              <div className="flex items-center gap-1.5">
                <span>Arithmetization</span>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="fill-current md:size-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Shows how the computation is represented mathematically.
                  </TooltipContent>
                </Tooltip>
              </div>
            </th>
            <th className="py-1.5 pr-3 text-2xs font-semibold uppercase text-gray-500 dark:text-gray-50">
              <div className="flex items-center gap-1.5">
                <span>PCS</span>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="fill-current md:size-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Shows what Polynomial Commitment Scheme is used.
                  </TooltipContent>
                </Tooltip>
              </div>
            </th>
            <th className="py-1.5 pr-3 text-2xs font-semibold uppercase text-gray-500 dark:text-gray-50">
              <div className="flex items-center gap-1.5">
                <span>Trusted setup</span>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="fill-current md:size-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Shows if the proof system requires a trusted setup.
                  </TooltipContent>
                </Tooltip>
              </div>
            </th>
            <th className="py-1.5 pr-3 text-2xs font-semibold uppercase text-gray-500 dark:text-gray-50">
              Source code
            </th>
          </tr>
        </thead>
        <tbody>
          {verifier.subVerifiers.map((sV) => (
            <tr
              className="h-8 border-b border-gray-200 text-sm *:pr-3 last:border-none dark:border-zinc-700"
              key={`${sV.proofSystem}-${sV.trustedSetup}`}
            >
              <td>{sV.name}</td>
              <td>{sV.proofSystem}</td>
              <td>{sV.mainArithmetization}</td>
              <td>{sV.mainPCS}</td>
              <td>{sV.trustedSetup ?? '?'}</td>
              <td>
                {sV.link ? <OutLink href={sV.link}>Link</OutLink> : EM_DASH}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
