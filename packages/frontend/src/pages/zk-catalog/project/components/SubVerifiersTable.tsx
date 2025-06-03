import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CustomLink } from '~/components/link/CustomLink'
import { EM_DASH } from '~/consts/characters'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'
import type { ZkCatalogProjectDetails } from '../utils/getZkCatalogProjectDetails'

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
          <tr className="border-divider border-b text-left align-bottom text-secondary">
            <th className="py-1.5 pr-3 font-medium text-2xs uppercase">Name</th>
            <th className="py-1.5 pr-3 font-medium text-2xs uppercase">
              Proof system
            </th>
            <th className="py-1.5 pr-3 font-medium text-2xs uppercase">
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
            <th className="py-1.5 pr-3 font-medium text-2xs uppercase">
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
            <th className="py-1.5 pr-3 font-medium text-2xs uppercase">
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
            <th className="py-1.5 pr-3 font-medium text-2xs uppercase">
              Source code
            </th>
          </tr>
        </thead>
        <tbody>
          {verifier.subVerifiers.map((sV) => (
            <tr
              className="h-8 border-divider border-b text-sm *:pr-3 last:border-none"
              key={`${sV.name}-${sV.proofSystem}-${sV.trustedSetup}`}
            >
              <td>{sV.name}</td>
              <td>{sV.proofSystem}</td>
              <td>{sV.mainArithmetization}</td>
              <td>{sV.mainPCS}</td>
              <td>{sV.trustedSetup ?? '?'}</td>
              <td>
                {sV.link ? (
                  <CustomLink href={sV.link}>Link</CustomLink>
                ) : (
                  EM_DASH
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
