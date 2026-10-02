import type { ReasonForBeingInOther } from '@l2beat/config'
import { formatActivityCount, pluralize } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import lowerFirst from 'lodash/lowerFirst'
import {
  TVS_ASSET_CATEGORIES,
  TVS_ASSET_CATEGORY_LABELS,
} from '~/components/breakdown/tvsAssetCategories'
import {
  ADDITIONAL_TRUST_ASSUMPTIONS_COMPARISON,
  WHY_LISTED_IN_OTHERS_HEADING,
} from '~/components/projects/sections/sectionCopy'
import type { RosetteValue } from '~/components/rosette/types'
import { externalLinks } from '~/consts/externalLinks'
import { getInteropTokenPagePath } from '~/pages/interop/utils/getInteropTokenUrl'
import type { ProjectL2Entry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import {
  interopProtocolUrl,
  listTopItems,
} from '~/server/markdown/interopMarkdown'
import {
  formatChange,
  formatCount,
  formatUsd,
  link,
  withSentiment,
} from '~/server/markdown/markdown'
import {
  getProjectStatusWarnings,
  type ProjectFact,
  renderProjectMarkdown,
} from '~/server/markdown/renderProjectMarkdown'
import { formatPercent } from '~/utils/calculatePercentageChange'

/** The markdown alternate of the scaling project page, from the entry the HTML page renders. */
export function renderL2ProjectMarkdown(entry: ProjectL2Entry): string {
  const api = '/api/scaling'
  const summaryRisks = getSummaryRisks(entry)
  return renderProjectMarkdown({
    name: entry.name,
    pagePath: `/layer2s/projects/${entry.slug}`,
    summary: {
      // Same order as the banners on the HTML page.
      warnings: compact([
        ...getProjectStatusWarnings(entry),
        entry.header.warning,
        entry.header.redWarning?.text,
        entry.header.emergencyWarning,
        ...getReasonsForBeingOther(entry),
      ]),
      facts: [
        ...getFacts(entry),
        ...getInteropFacts(entry),
        ...(summaryRisks.fact ? [summaryRisks.fact] : []),
      ],
      risks: summaryRisks.risks,
      description: entry.header.description,
    },
    header: {
      links: entry.header.links,
      badges: entry.header.badges,
      discoUiHref: entry.discoUiHref,
    },
    sections: entry.sections,
    apiLinks: {
      tvs: [
        { title: 'TVS chart (JSON)', url: `${api}/tvs/${entry.slug}` },
        {
          title: 'TVS breakdown by token (JSON)',
          url: `${api}/tvs/${entry.slug}/breakdown`,
        },
      ],
      activity: [
        {
          title: 'Activity chart (JSON)',
          url: `${api}/activity/${entry.slug}`,
        },
      ],
    },
  })
}

/** Labels and order follow the stats block at the top of the HTML page. */
function getFacts({
  header,
  stageConfig,
  hostChainName,
  isAppchain,
}: ProjectL2Entry): ProjectFact[] {
  return compact([
    {
      label: 'Total Value Secured',
      value: header.tvs?.breakdown
        ? formatTvs(
            header.tvs.breakdown,
            header.tvs.additionalTrustAssumptionsPercentage,
          )
        : NO_DATA,
      // The HTML shows these next to the TVS value and the tokens breakdown.
      warnings: compact([
        header.tvs?.warning,
        ...(header.tvs?.tokens.warnings ?? []),
      ]).map((w) => withSentiment(w.value, w.sentiment)),
    },
    header.tvs?.tokens.breakdown && {
      label: 'TVS by asset',
      value: formatTokensBreakdown(header.tvs.tokens.breakdown),
    },
    header.tvs?.tokens.breakdown &&
      header.tvs.tokens.breakdown.associated > 0 && {
        label: 'Associated tokens',
        value: formatAssociatedTokens(
          header.tvs.tokens.breakdown,
          header.tvs.tokens.associatedTokens,
        ),
      },
    {
      label: 'Past day UOPS',
      value: header.activity
        ? `${formatActivityCount(header.activity.lastDayUops)} (${formatChange(header.activity.uopsWeeklyChange, header.activity.uopsWeeklyChangePeriod)})`
        : NO_DATA,
    },
    stageConfig.stage !== 'NotApplicable' && {
      label: 'Stage',
      value: formatStage(stageConfig, isAppchain),
    },
    header.gasTokens &&
      header.gasTokens.length > 0 && {
        label: `Gas ${pluralize(header.gasTokens.length, 'token')}`,
        value: header.gasTokens.join(', '),
      },
    header.category
      ? { label: 'Type', value: header.category }
      : header.proofSystemType && {
          label: 'Proof system',
          value: header.proofSystemType,
        },
    header.purposes.length > 0 && {
      label: pluralize(header.purposes.length, 'Purpose'),
      value: header.purposes.join(', '),
    },
    // The HTML shows it for L3s only; an agent cannot infer Ethereum from its absence.
    { label: 'Host chain', value: hostChainName },
    header.chainId !== undefined && {
      label: 'Chain ID',
      value: String(header.chainId),
    },
  ])
}

/** The HTML shows a "No data" badge in place of a missing stat. */
const NO_DATA = 'No data'

function formatStage(
  stageConfig: ProjectL2Entry['stageConfig'],
  isAppchain: boolean,
) {
  if (stageConfig.stage === 'UnderReview') return 'Under review'
  if (stageConfig.stage === 'NotApplicable' || !isAppchain) {
    return stageConfig.stage
  }
  const considerations = stageConfig.additionalConsiderations?.short
  return considerations
    ? `${stageConfig.stage} (Appchain: ${considerations})`
    : `${stageConfig.stage} (Appchain)`
}

type TvsBreakdown = NonNullable<
  NonNullable<ProjectL2Entry['header']['tvs']>['breakdown']
>

function formatTvs(
  breakdown: TvsBreakdown,
  additionalTrustAssumptionsPercentage: number,
) {
  const change = formatChange(
    breakdown.totalChange,
    breakdown.totalChangePeriod,
  )
  const sources = [
    `canonically bridged ${formatUsd(breakdown.canonical)}`,
    `natively minted ${formatUsd(breakdown.native)}`,
    `externally bridged ${formatUsd(breakdown.external)}`,
  ].join(', ')
  const trust = `${formatPercent(additionalTrustAssumptionsPercentage)} ${ADDITIONAL_TRUST_ASSUMPTIONS_COMPARISON}`
  return `${formatUsd(breakdown.total)} (${change}; ${sources}; ${trust})`
}

type TvsTokens = NonNullable<ProjectL2Entry['header']['tvs']>['tokens']
type TokensBreakdown = NonNullable<TvsTokens['breakdown']>

/** The "Tokens breakdown" tooltip of the HTML page: only the asset classes with value. */
function formatTokensBreakdown(breakdown: TokensBreakdown) {
  if (breakdown.total === 0) return NO_DATA
  return TVS_ASSET_CATEGORIES.filter((category) => breakdown[category] > 0)
    .map((category) => {
      const value = breakdown[category]
      return `${TVS_ASSET_CATEGORY_LABELS[category]} ${formatUsd(value)} (${formatPercent(value / breakdown.total)})`
    })
    .join(', ')
}

/** Associated tokens overlap the asset classes, so the HTML lists them apart. */
function formatAssociatedTokens(
  breakdown: TokensBreakdown,
  associatedTokens: TvsTokens['associatedTokens'],
) {
  const symbols = associatedTokens.map((token) => token.symbol).join(', ')
  return `${symbols}: ${formatUsd(breakdown.associated)} (${formatPercent(breakdown.associated / breakdown.total)} of TVS)`
}

/** The notice the HTML page shows under the summary of a project in Others. */
function getReasonsForBeingOther({
  header,
  reasonsForBeingOther,
}: ProjectL2Entry) {
  if (
    header.category !== 'Other' ||
    !reasonsForBeingOther ||
    reasonsForBeingOther.length === 0
  ) {
    return []
  }
  return [
    [
      WHY_LISTED_IN_OTHERS_HEADING,
      ...reasonsForBeingOther.map(describeReasonForBeingOther),
      `Learn more about the ${link('recategorisation', externalLinks.articles.recategorisation)}.`,
    ].join(' '),
  ]
}

function describeReasonForBeingOther(reason: ReasonForBeingInOther) {
  return compact([
    `${reason.shortDescription}.`,
    reason.explanation,
    `Consequence: ${lowerFirst(reason.description)}`,
  ]).join(' ')
}

/**
 * The HTML rosette of an L3 opens on the risks stacked with its host chain,
 * or on the L3's own while the project is under review. The summary lists
 * the same ones and says which, as the Risk analysis section shows both.
 */
function getSummaryRisks({
  rosette,
  underReviewStatus,
  name,
  hostChainName,
}: ProjectL2Entry): { risks: RosetteValue[]; fact?: ProjectFact } {
  if (!rosette.stacked || !rosette.host) {
    return { risks: rosette.self }
  }
  if (underReviewStatus === 'config') {
    return {
      risks: rosette.self,
      fact: {
        label: 'Risks shown',
        value: `${name} alone, while under review; Risk analysis also lists them combined with ${hostChainName}`,
      },
    }
  }
  return {
    risks: rosette.stacked,
    fact: {
      label: 'Risks shown',
      value: `combined with host chain ${hostChainName}; Risk analysis also lists each separately`,
    },
  }
}

/** The cross-chain block of the HTML summary; its volume and top lists cover the last 24 hours. */
function getInteropFacts({ header }: ProjectL2Entry): ProjectFact[] {
  const interop = header.interop
  if (!interop) return []
  const linkProtocol = (protocol: {
    slug: string | undefined
    name: string
  }) =>
    protocol.slug
      ? link(protocol.name, interopProtocolUrl(protocol.slug))
      : protocol.name
  const linkToken = (token: { id: string; symbol: string }) =>
    link(token.symbol, getInteropTokenPagePath({ ...token, issuer: null }))
  return compact([
    {
      label: 'Last 24h cross-chain volume',
      value: formatUsd(interop.volume),
    },
    {
      label: 'Last 24h cross-chain transfers',
      value: formatCount(interop.transferCount),
    },
    interop.protocols.items.length > 0 && {
      label: 'Interop protocols used (last 24h volume)',
      value: listTopItems(
        interop.protocols,
        (protocol) =>
          `${linkProtocol(protocol)} (${formatUsd(protocol.volume)})`,
      ).join(', '),
    },
    interop.tokens.items.length > 0 && {
      label: 'Tokens by volume (last 24h)',
      value: listTopItems(
        interop.tokens,
        (token) => `${linkToken(token)} (${formatUsd(token.volume)})`,
      ).join(', '),
    },
  ])
}
