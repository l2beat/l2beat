import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { InfoIcon } from '~/icons/Info'
import type {
  FrameworkId,
  FrameworkOverview,
} from '~/server/features/scaling/interop/getFrameworkComparisonData'
import { ARTICLE_CLAIMS, CLAIM_ROWS, TOOLTIPS } from '../data/articleClaims'

interface Props {
  frameworks: FrameworkOverview[]
}

// Column order matches article: ITS, NTT, OFT, Warp Token
const CLAIMS_ORDER: FrameworkId[] = [
  'axelar-its',
  'wormhole-ntt',
  'layerzero',
  'hyperlane-hwr',
]

export function ComparisonTable({ frameworks }: Props) {
  const fwMap = Object.fromEntries(frameworks.map((fw) => [fw.id, fw]))

  return (
    <PrimaryCard className="overflow-x-auto">
      <h2 className="mb-4 font-bold text-heading-20 md:text-heading-24">
        Full Framework Comparison
        <span className="ml-2 font-normal text-paragraph-12 text-secondary md:text-paragraph-13">
          Article Claims + L2BEAT Data
        </span>
      </h2>
      <table className="w-full min-w-[700px] border-collapse text-label-value-14">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-surface-primary px-3 py-2 text-left font-semibold text-2xs text-secondary uppercase tracking-wider">
              Category
            </th>
            {CLAIMS_ORDER.map((id) => (
              <th
                key={id}
                className="px-3 py-2 text-left font-semibold text-2xs text-secondary uppercase tracking-wider"
              >
                {fwMap[id]?.shortName} ({fwMap[id]?.provider})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CLAIM_ROWS.map((row, i) => {
            if (typeof row === 'string') {
              return <SectionHeader key={i} title={row.slice(1)} />
            }

            if (row.dynamic) {
              return (
                <tr key={i} className="group">
                  <td className="sticky left-0 z-10 border-divider border-b bg-surface-primary px-3 py-2.5 font-medium group-hover:bg-surface-secondary">
                    {row.category}
                  </td>
                  {CLAIMS_ORDER.map((id) => (
                    <td
                      key={id}
                      className="border-divider border-b px-3 py-2.5 group-hover:bg-surface-secondary"
                    >
                      <span className="text-positive">
                        {fwMap[id] ? row.dynamic(fwMap[id]) : 'N/A'}
                      </span>
                    </td>
                  ))}
                </tr>
              )
            }

            const tooltip = TOOLTIPS[row.key]

            return (
              <tr key={i} className="group">
                <td className="sticky left-0 z-10 border-divider border-b bg-surface-primary px-3 py-2.5 font-medium group-hover:bg-surface-secondary">
                  <span className="flex items-center gap-1">
                    {row.category}
                    {tooltip && (
                      <Tooltip>
                        <TooltipTrigger className="mb-px">
                          <InfoIcon className="size-3 fill-secondary" />
                        </TooltipTrigger>
                        <TooltipContent>{tooltip}</TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                </td>
                {CLAIMS_ORDER.map((id) => {
                  const value = ARTICLE_CLAIMS[id]?.[row.key]
                  return (
                    <td
                      key={id}
                      className="border-divider border-b px-3 py-2.5 leading-relaxed group-hover:bg-surface-secondary"
                    >
                      <span className="text-yellow-400/80 italic">
                        {value ?? 'N/A'}
                      </span>
                      <span className="ml-1.5 inline-block rounded bg-yellow-500/15 px-1 py-px font-semibold text-[10px] text-yellow-400 uppercase">
                        unverified
                      </span>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </PrimaryCard>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <tr>
      <td
        colSpan={5}
        className="bg-surface-secondary px-3 py-2.5 font-bold text-2xs text-secondary uppercase tracking-wider"
      >
        {title}
      </td>
    </tr>
  )
}
