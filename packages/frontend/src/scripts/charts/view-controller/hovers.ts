import { Milestone } from '@l2beat/config'

import { formatCurrency, formatCurrencyExactValue } from '../../../utils/format'
import { formatTps } from '../../../utils/formatTps'
import { isMobile } from '../../utils/isMobile'
import { POINT_CLASS_NAMES, PointStyle } from '../styles'
import { TokenInfo } from '../types'

export function renderMilestoneHover(milestone: Milestone) {
  return renderHover([
    renderDateRow(milestone.date),
    renderNameRow(milestone.name),
    milestone.description && renderDescriptionRow(milestone.description),
    isMobile() && renderMilestoneLink(milestone.link),
  ])
}

export interface TvlData {
  date: string
  usd: number
  eth: number
}

export function renderTvlHover(data: TvlData, useAltCurrency: boolean) {
  const formattedUsd = formatCurrencyExactValue(data.usd, 'USD')
  const formattedEth = formatCurrencyExactValue(data.eth, 'ETH')
  if (useAltCurrency) {
    return renderHover([
      renderDateRow(data.date),
      renderDetailedRow({
        title: 'ETH',
        value: formattedEth,
      }),
      renderDetailedRow({
        title: 'USD',
        value: formattedUsd,
      }),
    ])
  } else {
    return renderHover([
      renderDateRow(data.date),
      renderDetailedRow({
        title: 'USD',
        value: formattedUsd,
      }),
      renderDetailedRow({
        title: 'ETH',
        value: formattedEth,
      }),
    ])
  }
}

export interface DetailedTvlData {
  date: string
  usd: number
  cbv: number
  ebv: number
  nmv: number
  eth: number
  cbvEth: number
  ebvEth: number
  nmvEth: number
}

export function renderDetailedTvlHover(
  data: DetailedTvlData,
  useAltCurrency: boolean,
) {
  const currency = useAltCurrency ? 'eth' : 'usd'

  const total = useAltCurrency ? data.eth : data.usd
  const selectedCbv = useAltCurrency ? data.cbvEth : data.cbv
  const selectedEbv = useAltCurrency ? data.ebvEth : data.ebv
  const selectedNmv = useAltCurrency ? data.nmvEth : data.nmv

  return renderHover([
    renderDateRow(data.date),
    renderDetailedRow({
      title: 'Total TVL',
      value: formatCurrency(total, currency),
    }),
    renderHorizontalSeparator(),
    renderDetailedRow({
      title: 'Canonically Bridged',
      shortTitle: 'Canonical',
      value: formatCurrency(selectedCbv, currency),
      icon: 'purpleCircle',
    }),
    renderDetailedRow({
      title: 'Externally Bridged',
      shortTitle: 'External',
      value: formatCurrency(selectedEbv, currency),
      icon: 'yellowTriangle',
    }),
    renderDetailedRow({
      title: 'Natively Minted',
      shortTitle: 'Native',
      value: formatCurrency(selectedNmv, currency),
      icon: 'pinkSquare',
    }),
  ])
}

function renderMilestoneLink(link: string) {
  return `
  <a href="${link}" class="font-semibold text-blue-700 underline transition-colors hover:text-blue-550 dark:text-blue-500 dark:hover:text-blue-550" target="_blank" rel="noreferrer noopener">
    Learn more
  </a>`
}

export interface ActivityData {
  date: string
  tps: number
  ethTps: number
}

export function renderActivityHover(
  data: ActivityData,
  includeEthereumTps: boolean,
  isAggregate: boolean,
) {
  const projectTpsRow = renderDetailedRow({
    title: `Project${isAggregate ? 's' : ''}`,
    value: formatTps(data.tps),
    icon: 'redCircle',
  })
  const ethTpsRow = renderDetailedRow({
    title: 'Ethereum',
    value: formatTps(data.ethTps),
    icon: 'blueSquare',
  })
  if (!includeEthereumTps) {
    return renderHover([
      renderDateRow(data.date),
      renderDetailedRow({
        title: 'Average TPS',
      }),
      renderHorizontalSeparator(),
      projectTpsRow,
    ])
  }

  if (data.tps > data.ethTps) {
    return renderHover([
      renderDateRow(data.date),
      renderDetailedRow({
        title: 'Average TPS',
      }),
      renderHorizontalSeparator(),
      projectTpsRow,
      ethTpsRow,
    ])
  } else {
    return renderHover([
      renderDateRow(data.date),
      renderDetailedRow({
        title: 'Average TPS',
      }),
      renderHorizontalSeparator(),
      ethTpsRow,
      projectTpsRow,
    ])
  }
}

export interface TokenTvlData {
  date: string
  token: number
  usd: number
}

export function renderTokenTvlHover(
  data: TokenTvlData,
  tokenSymbol: string,
  tokenType: TokenInfo['type'],
) {
  const styles: Record<TokenInfo['type'], PointStyle | undefined> = {
    CBV: 'purpleCircle',
    EBV: 'yellowTriangle',
    NMV: 'pinkSquare',
    regular: undefined,
  }
  const style = styles[tokenType]
  const formattedUsd = formatCurrencyExactValue(data.usd, 'USD')
  const formattedToken = formatCurrencyExactValue(data.token, tokenSymbol)
  return renderHover([
    renderDateRow(data.date),
    renderDetailedRow({
      title: tokenSymbol,
      value: formattedToken,
      icon: isMobile() ? undefined : style,
    }),
    renderDetailedRow({
      title: 'USD',
      value: formattedUsd,
      icon: isMobile() ? undefined : 'gap',
    }),
  ])
}

function renderHover(rows: (string | undefined | false)[]) {
  return rows.filter((x) => !!x).join('')
}

function renderDateRow(date: string) {
  return `<div class="mb-1">${date}</div>`
}

function renderHorizontalSeparator() {
  return `<hr class="w-full border-gray-200 dark:border-gray-650 md:border-t-1 my-1"/>`
}

interface DetailedRowProps {
  title: string
  shortTitle?: string
  value?: string
  icon?: PointStyle | 'gap'
}

function renderDetailedRow(props: DetailedRowProps) {
  const shortTitleHtml = props.shortTitle
    ? `<span class="text-gray-50 text-sm md:hidden">${props.shortTitle}</span>`
    : ''

  const valueHtml = props.value
    ? `<span class="font-bold tabular-nums">${props.value}</span>`
    : ''
  return `
    <div class="flex w-full justify-between items-center gap-2">
      <div>
        ${renderIcon(props.icon)}
        <span class="dark:text-gray-50 text-gray-700 text-sm ${
          props.shortTitle ? 'hidden md:inline' : ''
        }">${props.title}</span>
        ${shortTitleHtml}
      </div>
      ${valueHtml}
    </div>
  `
}

function renderIcon(icon?: PointStyle | 'gap') {
  if (icon === 'gap') {
    return `<div class="inline-block mr-1 w-2 h-2"></div>`
  }
  return icon
    ? `<div class="inline-block mr-1 relative -top-px ${POINT_CLASS_NAMES[icon]}"></div>`
    : ''
}

function renderNameRow(name: string) {
  return `<div class="max-w-[216px] mb-2 font-bold flex flex-wrap"><svg class="absolute mt-[2px] md:mt-1 dark:fill-green-500 dark:stroke-white fill-green-600 stroke-green-200" width="11" height="10" viewBox="0 0 11 10">
  <rect x="5.24268" y="0.0502174" width="7" height="7" rx="1.5" transform="rotate(45 5.24268 0.0502174)"/>
  </svg><span class='ml-4 text-left'>${name}</span></div>`
}

function renderDescriptionRow(description: string) {
  return `<div class="max-w-[216px] mb-1 text-left">${description}</div>`
}
