import type { ReasonForBeingInOther } from '@l2beat/config'
import { formatActivityCount, pluralize } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { externalLinks } from '~/consts/externalLinks'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import { getInteropTokenPagePath } from '~/pages/interop/utils/getInteropTokenUrl'
import type { ProjectL2Entry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import { listTopItems } from '~/server/markdown/interopMarkdown'
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
  const api = `${PRODUCTION_ORIGIN}/api/scaling`
  const combinedRisks = getCombinedRisks(entry)
  return renderProjectMarkdown({
    name: entry.name,
    // Production URLs, like the canonical link: the document is meant to be
    // cited, whichever deployment rendered it.
    pageUrl: `${PRODUCTION_ORIGIN}/layer2s/projects/${entry.slug}`,
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
        ...(combinedRisks ? [combinedRisks.fact] : []),
      ],
      risks: combinedRisks?.risks ?? entry.rosette.self,
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
        value: formatAssociatedTokens(header.tvs.tokens),
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
  const trust = `${formatPercent(additionalTrustAssumptionsPercentage)} ${ADDITIONAL_TRUST_ASSUMPTIONS}`
  return `${formatUsd(breakdown.total)} (${change}; ${sources}; ${trust})`
}

/** The wording of the HTML TVS tooltip, which says what the percentage is relative to. */
const ADDITIONAL_TRUST_ASSUMPTIONS =
  "with additional trust assumptions compared to the tokens involved and the Stage assigned to the project's canonical messaging bridge"

type TvsTokens = NonNullable<ProjectL2Entry['header']['tvs']>['tokens']
type TokensBreakdown = NonNullable<TvsTokens['breakdown']>

/** The "Tokens breakdown" tooltip of the HTML page: only the asset classes with value. */
function formatTokensBreakdown(breakdown: TokensBreakdown) {
  if (breakdown.total === 0) return NO_DATA
  const assets: [string, number][] = [
    ['ETH & derivatives', breakdown.ether],
    ['Stablecoins', breakdown.stablecoin],
    ['BTC & derivatives', breakdown.btc],
    ['Other', breakdown.other],
    ['Public RWAs', breakdown.rwaPublic],
    ['Restricted RWAs', breakdown.rwaRestricted],
  ]
  return assets
    .filter(([, value]) => value > 0)
    .map(
      ([title, value]) =>
        `${title} ${formatUsd(value)} (${formatPercent(value / breakdown.total)})`,
    )
    .join(', ')
}

/** Associated tokens overlap the asset classes, so the HTML lists them apart. */
function formatAssociatedTokens({ breakdown, associatedTokens }: TvsTokens) {
  const associated = breakdown?.associated ?? 0
  const total = breakdown?.total ?? 0
  const symbols = associatedTokens.map((token) => token.symbol).join(', ')
  return `${symbols}: ${formatUsd(associated)} (${formatPercent(associated / total)} of TVS)`
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
      'Why is the project listed in others?',
      ...reasonsForBeingOther.map(describeReasonForBeingOther),
      `Learn more about the ${link('recategorisation', externalLinks.articles.recategorisation)}.`,
    ].join(' '),
  ]
}

function describeReasonForBeingOther(reason: ReasonForBeingInOther) {
  return compact([
    `${reason.shortDescription}.`,
    reason.explanation,
    `Consequence: ${lowercaseFirstLetter(reason.description)}`,
  ]).join(' ')
}

function lowercaseFirstLetter(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1)
}

/**
 * The HTML rosette of an L3 opens on the risks stacked with its host chain,
 * so the summary lists those and says so.
 */
function getCombinedRisks({
  rosette,
  underReviewStatus,
  name,
  hostChainName,
}: ProjectL2Entry) {
  if (!rosette.stacked || !rosette.host || underReviewStatus === 'config') {
    return undefined
  }
  return {
    risks: rosette.stacked,
    fact: {
      label: 'Risks shown',
      value: `combined risks of ${name} and its host chain ${hostChainName}, as the HTML rosette shows them by default; the Risk analysis section lists both separately`,
    } satisfies ProjectFact,
  }
}

/** The cross-chain block of the HTML summary; its volume and top lists cover the last 24 hours. */
function getInteropFacts({ header, sections }: ProjectL2Entry): ProjectFact[] {
  const interop = header.interop
  if (!interop) return []
  const protocolSlugs = new Map(
    sections.flatMap((section) =>
      section.type === 'InteropFlowsSection'
        ? section.props.protocols.map((p) => [p.id, p.slug] as const)
        : [],
    ),
  )
  const linkProtocol = (protocol: { id: string; name: string }) => {
    const slug = protocolSlugs.get(protocol.id)
    return slug
      ? link(protocol.name, `${PRODUCTION_ORIGIN}/interop/protocols/${slug}`)
      : protocol.name
  }
  const linkToken = (token: { id: string; symbol: string }) =>
    link(
      token.symbol,
      `${PRODUCTION_ORIGIN}${getInteropTokenPagePath({ ...token, issuer: null })}`,
    )
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
