import type {
  ProjectAssociatedToken,
  WarningWithSentiment,
} from '@l2beat/config'
import {
  AdditionalTrustAssumptionsBanner,
  AdditionalTrustAssumptionsText,
} from '~/components/breakdown/AdditionalTrustAssumptions'
import {
  TokenBreakdown,
  TokenBreakdownTooltipContent,
} from '~/components/breakdown/TokenBreakdown'
import {
  ValueSecuredBreakdown,
  ValueSecuredBreakdownTooltipContent,
} from '~/components/breakdown/ValueSecuredBreakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'
import { TableLink } from '../../../../../components/table/TableLink'

interface TotalValueSecuredCellProps {
  href: string
  total: number
  breakdown:
    | {
        type: 'bridgeType'
        external: number
        canonical: number
        native: number
      }
    | {
        type: 'assetCategory'
        ether: number
        associated: number
        stablecoin: number
        btc: number
        other: number
        rwaPublic: number
        rwaRestricted: number
      }
  additionalTrustAssumptionsPercentage: number
  change: number
  tvsWarnings?: WarningWithSentiment[]
  associatedTokens?: ProjectAssociatedToken[]
}

export function TotalValueSecuredCell(props: TotalValueSecuredCellProps) {
  const tvsWarnings = props.tvsWarnings ?? []
  const anyBadWarnings = tvsWarnings.some((w) => w?.sentiment === 'bad')

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TableLink href={props.href}>
          <div className="flex flex-col items-end max-md:py-1">
            <div className="flex items-center gap-1">
              {tvsWarnings.length ? (
                <RoundedWarningIcon
                  className="size-4"
                  sentiment={anyBadWarnings ? 'bad' : 'warning'}
                />
              ) : null}
              <ValueWithPercentageChange change={props.change}>
                {formatDollarValueNumber(props.total)}
              </ValueWithPercentageChange>
            </div>
            {props.breakdown.type === 'bridgeType' ? (
              <div className="inline-flex flex-col items-end gap-1">
                <ValueSecuredBreakdown
                  canonical={props.breakdown.canonical}
                  external={props.breakdown.external}
                  native={props.breakdown.native}
                />
                <AdditionalTrustAssumptionsText
                  percentage={props.additionalTrustAssumptionsPercentage}
                />
              </div>
            ) : (
              <TokenBreakdown
                total={props.total}
                ether={props.breakdown.ether}
                stablecoin={props.breakdown.stablecoin}
                btc={props.breakdown.btc}
                other={props.breakdown.other}
                rwaPublic={props.breakdown.rwaPublic}
                rwaRestricted={props.breakdown.rwaRestricted}
                className="h-[3px] w-[200px]"
              />
            )}
          </div>
        </TableLink>
      </TooltipTrigger>
      <TooltipContent fitContent className="flex flex-col gap-2">
        {props.breakdown.type === 'bridgeType' ? (
          <>
            <ValueSecuredBreakdownTooltipContent
              canonical={props.breakdown.canonical}
              external={props.breakdown.external}
              native={props.breakdown.native}
              change={props.change}
              tvsWarnings={tvsWarnings}
              associatedTokenSymbols={props.associatedTokens?.map(
                (t) => t.symbol,
              )}
            />
            <AdditionalTrustAssumptionsBanner
              percentage={props.additionalTrustAssumptionsPercentage}
            />
          </>
        ) : (
          <TokenBreakdownTooltipContent
            total={props.total}
            ether={props.breakdown.ether}
            stablecoin={props.breakdown.stablecoin}
            btc={props.breakdown.btc}
            other={props.breakdown.other}
            rwaPublic={props.breakdown.rwaPublic}
            rwaRestricted={props.breakdown.rwaRestricted}
            associated={props.breakdown.associated}
            tvsWarnings={tvsWarnings}
            associatedTokens={props.associatedTokens ?? []}
          />
        )}
      </TooltipContent>
    </Tooltip>
  )
}
