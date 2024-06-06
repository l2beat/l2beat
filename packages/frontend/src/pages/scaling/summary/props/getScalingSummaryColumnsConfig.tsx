import React from 'react'

import { compact } from 'lodash'
import { ExcludeAssociatedTokensWrapper } from '../../../../components/ExcludeAssociatedTokensWrapper'
import { StageCell } from '../../../../components/stages/StageCell'
import { NumberCell } from '../../../../components/table/NumberCell'
import { RosetteCell } from '../../../../components/table/RosetteCell'
import { TotalCell } from '../../../../components/table/TotalCell'
import {
  TypeCell,
  TypeColumnTooltip,
} from '../../../../components/table/TypeCell'
import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
import { getStageOrderValue } from '../../../../components/table/props/sorting/getStageOrderValue'
import { ColumnConfig } from '../../../../components/table/types'
import {
  ScalingL2SummaryViewEntry,
  ScalingL3SummaryViewEntry,
  ScalingSummaryViewEntry,
} from '../types'

export function getActiveScalingSummaryColumnsConfig() {
  const columns: ColumnConfig<ScalingL2SummaryViewEntry>[] = [
    ...getProjectWithIndexColumns(),
    {
      name: 'Risks',
      tooltip: 'Risks associated with this project.',
      idHref: 'risk-analysis',
      minimalWidth: true,
      align: 'center',
      getValue: (project) => (
        <RosetteCell
          riskValues={project.riskValues}
          isUpcoming={project.isUpcoming}
          isUnderReview={project.showProjectUnderReview}
        />
      ),
    },
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip />,
      shortName: 'Type',
      getValue: (project) => (
        <TypeCell provider={project.provider}>{project.category}</TypeCell>
      ),
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Stage',
      idHref: 'stage' as const,
      tooltip: 'Rollup stage based on its features and maturity.',
      getValue: (project) => <StageCell stageConfig={project.stage} />,
      sorting: {
        getOrderValue: (project) => getStageOrderValue(project.stage),
        rule: 'numeric',
      },
    },
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this project.',
      className: 'whitespace-normal',
      getValue: (project) => project.purposes.join(', '),
    },
    {
      name: 'Total',
      tooltip:
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.',
      align: 'right',
      headClassName: '-translate-x-[72px]',
      getValue: (project) => <TotalCell project={project} />,
      sorting: {
        getOrderValue: (project) => ({
          'included-associated-tokens': project.data?.tvl.value,
          'excluded-associated-tokens': project.data?.excludedTokens?.tvl.value,
        }),
        defaultOrderKey: 'included-associated-tokens',
        rule: 'numeric',
        defaultState: 'desc',
      },
    },
    {
      name: 'Mkt share',
      tooltip: 'Share of the sum of total value locked of all projects.',
      align: 'right',
      minimalWidth: true,
      className: 'hidden 2xl:table-cell',
      headClassName: '!pr-4',
      getValue: (project) => (
        <ExcludeAssociatedTokensWrapper>
          <ExcludeAssociatedTokensWrapper.Included>
            {project.data?.marketShare ? (
              <NumberCell className="pr-4">
                {project.data.marketShare.displayValue}
              </NumberCell>
            ) : (
              <span className="pr-4">—</span>
            )}
          </ExcludeAssociatedTokensWrapper.Included>
          <ExcludeAssociatedTokensWrapper.Excluded>
            {project.data?.excludedTokens?.marketShare ? (
              <NumberCell className="pr-4">
                {project.data.excludedTokens.marketShare.displayValue}
              </NumberCell>
            ) : (
              <span className="pr-4">—</span>
            )}
          </ExcludeAssociatedTokensWrapper.Excluded>
        </ExcludeAssociatedTokensWrapper>
      ),
      sorting: {
        getOrderValue: (project) => ({
          'included-associated-tokens': project.data?.marketShare.value,
          'excluded-associated-tokens':
            project.data?.excludedTokens?.marketShare.value,
        }),
        defaultOrderKey: 'included-associated-tokens',
        rule: 'numeric',
      },
    },
  ]

  return columns
}

export function getUpcomingScalingSummaryColumnsConfig() {
  const columns: ColumnConfig<ScalingSummaryViewEntry>[] = [
    ...getProjectWithIndexColumns(),
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip />,
      shortName: 'Type',
      getValue: (project) => (
        <TypeCell provider={project.provider}>{project.category}</TypeCell>
      ),
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this project.',
      getValue: (project) => project.purposes.join(', '),
    },
  ]

  return columns
}

export function getArchivedScalingSummaryColumnsConfig() {
  const columns: ColumnConfig<ScalingL2SummaryViewEntry>[] = [
    ...getProjectWithIndexColumns(),
    {
      name: 'Risks',
      tooltip: 'Risks associated with this project.',
      minimalWidth: true,
      align: 'center',
      getValue: (project) => <RosetteCell riskValues={project.riskValues} />,
    },
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip />,
      shortName: 'Type',
      getValue: (project) => (
        <TypeCell provider={project.provider}>{project.category}</TypeCell>
      ),
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this project.',
      getValue: (project) => project.purposes.join(', '),
    },
    {
      name: 'Total',
      tooltip:
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.',
      align: 'right',
      noPaddingRight: true,
      headClassName: '-translate-x-[72px]',
      getValue: (project) => (
        <>
          <NumberCell className="font-bold">
            {project.data?.tvl.displayValue}
          </NumberCell>
          {!project.isArchived ? (
            <NumberCell
              signed
              className="ml-1 w-[72px] !text-base font-medium "
            >
              {project.data?.sevenDayChange}
            </NumberCell>
          ) : (
            <span className="w-[72px]" />
          )}
        </>
      ),
      sorting: {
        getOrderValue: (project) => project.data?.tvl.value,
        rule: 'numeric',
        defaultState: 'desc',
      },
    },
  ]

  return columns
}

export function getLayer3sScalingSummaryColumnsConfig(layer3sTvl: boolean) {
  const columns: ColumnConfig<ScalingL3SummaryViewEntry>[] = compact([
    ...getProjectWithIndexColumns(),
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip />,
      shortName: 'Type',
      getValue: (project) => <TypeCell>{project.category}</TypeCell>,
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Technology',
      tooltip: 'The technology stack used.',
      shortName: 'Tech',
      getValue: (project) =>
        project.provider === 'Arbitrum' ? 'Arbitrum Orbit' : project.provider,
    },
    {
      name: 'Host Chain',
      tooltip: 'The chain, on top of which the L3 is built.',
      getValue: (project) => project.hostChainName,
    },
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this project.',
      className: 'whitespace-normal',
      getValue: (project) => project.purposes.join(', '),
    },

    layer3sTvl && {
      name: 'Total',
      tooltip:
        'Total value locked in escrow contracts on the base chain displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.',
      align: 'right',
      headClassName: '!pr-4',
      getValue: (project) => <TotalCell project={project} className="pr-4" />,
      sorting: {
        getOrderValue: (project) => ({
          'included-associated-tokens': project.data?.tvl.value,
          'excluded-associated-tokens': project.data?.excludedTokens?.tvl.value,
        }),
        defaultOrderKey: 'included-associated-tokens',
        rule: 'numeric',
        defaultState: 'desc',
      },
    },
  ])

  return columns
}
