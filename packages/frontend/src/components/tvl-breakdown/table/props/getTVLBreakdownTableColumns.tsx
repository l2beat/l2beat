import React from 'react'

import { TVLProjectBreakdown } from '../../../../pages/scaling-projects-tvl-breakdown/props/getTvlBreakdownView'
import { formatLargeNumberWithCommas } from '../../../../utils'
import { TokenAddressCell } from '../TokenAddressCell'
import { TokenNameCell } from '../TokenNameCell'
import { ColumnConfig } from '../TVLBreakdownTableView'

export function getNativelyMintedColumns(explorer: string) {
  const columns: ColumnConfig<TVLProjectBreakdown['native'][number]>[] = [
    {
      name: 'TOKEN',
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (token) => <TokenNameCell assetId={token.assetId} />,
    },
    {
      name: 'CONTRACT',
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (token) =>
        token.tokenAddress && (
          <TokenAddressCell address={token.tokenAddress} explorer={explorer} />
        ),
    },
    {
      name: 'TYPE',
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (token) => <TokenNameCell assetId={token.assetId} />,
    },
    {
      name: 'AMOUNT',
      minimalWidth: true,
      alignRight: true,
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <div className="text-xs font-medium">
          {formatLargeNumberWithCommas(Number(token.amount))}
        </div>
      ),
    },
    {
      name: 'VALUE',
      minimalWidth: true,
      alignRight: true,
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <div className="text-xs font-medium">
          ${formatLargeNumberWithCommas(Number(token.usdValue))}
        </div>
      ),
    },
    //   {
    //     name: 'Name',
    //     headClassName: 'pl-8',
    //     getValue: (project) => <ProjectCell type="layer2" project={project} />,
    //   },
    //   {
    //     name: 'Risks',
    //     tooltip: 'Risks associated with this project.',
    //     idHref: 'risk-analysis',
    //     minimalWidth: true,
    //     alignCenter: true,
    //     getValue: (project) => (
    //       <RosetteCell
    //         riskValues={project.riskValues}
    //         isUpcoming={project.isUpcoming}
    //       />
    //     ),
    //   },
    //   {
    //     name: 'Technology',
    //     tooltip:
    //       'Type of this Layer 2. Determines data availability and proof system used.<br>ZK Rollups = Validity Proofs + onchain data<br>Optimistic Rollups = Fraud Proofs + onchain data<br>Validiums = Validity Proofs + offchain data<br>Optimiums = Fraud Proofs + offchain data',
    //     shortName: 'Tech',
    //     getValue: (project) => (
    //       <TechnologyCell provider={project.provider}>
    //         {project.category}
    //       </TechnologyCell>
    //     ),
    //   },
    //   ...(stagesEnabled
    //     ? [
    //         {
    //           name: 'Stage',
    //           idHref: 'stage' as const,
    //           tooltip: 'Rollup stage based on its features and maturity.',
    //           alignCenter: true as const,
    //           getValue: (project: ScalingTvlViewEntry) => (
    //             <StageCell item={project.stage} />
    //           ),
    //         },
    //       ]
    //     : []),
    //   {
    //     name: 'Purpose',
    //     tooltip: 'Functionality supported by this Layer 2.',
    //     getValue: (project) => project.purpose,
    //   },
    //   {
    //     name: 'Total',
    //     tooltip: detailedTvlEnabled
    //       ? 'Total value locked in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.'
    //       : 'Total value locked in escrow contracts on Ethereum displayed together with a percentage change compared to 7D ago. Some project may include natively minted assets.',
    //     alignRight: true,
    //     noPaddingRight: true,
    //     headClassName: '-translate-x-[72px]',
    //     getValue: (project) => (
    //       <>
    //         <NumberCell className="font-bold" tooltip={project.tvlTooltip}>
    //           {project.tvl}
    //         </NumberCell>
    //         <NumberCell signed className="ml-1 w-[72px] !text-base font-medium ">
    //           {project.sevenDayChange}
    //         </NumberCell>
    //       </>
    //     ),
    //   },
    //   {
    //     name: 'Mkt share',
    //     tooltip: 'Share of the sum of total value locked of all projects.',
    //     alignRight: true,
    //     minimalWidth: true,
    //     headClassName: 'pr-4',
    //     getValue: (project) =>
    //       project.tvlBreakdown && (
    //         <NumberCell className="pr-4">{project.marketShare}</NumberCell>
    //       ),
    //   },
  ]

  return columns
}
