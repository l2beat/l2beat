import { formatSeconds } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { Badge } from '~/components/badge/Badge'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { SentimentText } from '~/components/SentimentText'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getScalingCommonProjectColumns } from '~/components/table/common-project-columns/ScalingCommonProjectColumns'
import { GovernanceIcon } from '~/icons/pages/Governance'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import type { GovernanceProjectEntry } from '~/server/features/governance/getGovernanceProjectsEntries'

const columnHelper = createColumnHelper<GovernanceProjectEntry>()

export const governanceProjectColumns = [
  ...getScalingCommonProjectColumns(
    columnHelper,
    (row) => `/scaling/projects/${row.slug}#permissions`,
  ),
  columnHelper.accessor((e) => e.multisig?.memberCount ?? -1, {
    id: 'txProcessing',
    header: 'Tx processing',
    meta: {
      tooltip:
        'How transaction processing is enforced on-chain. Validity proofs are checked up-front (pre-audited). Optimistic proofs are attested by the proposer and stand unless challenged within the given window.',
    },
    cell: (ctx) => (
      <TxProcessingCell
        proofSystem={ctx.row.original.proofSystem}
        challengePeriodSeconds={ctx.row.original.challengePeriodSeconds}
      />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
  }),
  columnHelper.accessor((e) => adjustTableValue(e.censorship), {
    id: 'censorship',
    header: 'Tx censorship',
    meta: {
      tooltip:
        'Whether users can be censored by the sequencer, and the mechanism (if any) they have to escape it.',
    },
    cell: (ctx) => (
      <CensorshipCell value={ctx.row.original.censorship} />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.censorship, b.original.censorship),
  }),
  columnHelper.display({
    id: 'txCost',
    header: 'Tx pricing',
    meta: {
      tooltip:
        "How L2 transaction prices are set and who can change them. Some projects use a bounded algorithmic fee market (e.g. EIP-1559). Others expose operator-set scalars that the team can adjust unilaterally — meaning they can raise user fees without governance.",
    },
    cell: (ctx) => (
      <TxCostCell
        slug={ctx.row.original.slug}
        stack={ctx.row.original.stack}
      />
    ),
  }),
  columnHelper.display({
    id: 'privacy',
    header: 'Tx privacy',
    meta: {
      tooltip:
        'Whether transaction contents (sender, receiver, amount, calldata) are hidden from third parties, and what metadata still leaks.',
    },
    cell: (ctx) => <PrivacyCell slug={ctx.row.original.slug} />,
  }),
  columnHelper.accessor((e) => securityRank(e.stage), {
    id: 'custody',
    header: 'Funds policy',
    meta: {
      tooltip:
        'Who can freeze withdrawals, drain the escrow, or push upgrades that affect funds held on the chain. In Stage 1 or 2 projects, this requires compromising at least 75% of a Security Council. In single-entity projects, one actor suffices.',
    },
    cell: (ctx) => (
      <CustodyCell
        stage={ctx.row.original.stage}
        multisig={ctx.row.original.multisig}
      />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
  }),
  columnHelper.accessor((e) => adjustTableValue(e.upgrade), {
    id: 'upgrade',
    header: 'Exit window',
    meta: {
      tooltip:
        'How much notice users have to withdraw before an unwanted upgrade takes effect on funds-holding contracts.',
    },
    cell: (ctx) => <UpgradeCell entry={ctx.row.original} />,
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) => sortTableValues(a.original.upgrade, b.original.upgrade),
  }),
]

function isCouncilStage(stage: GovernanceProjectEntry['stage']): boolean {
  return stage === 'Stage 1' || stage === 'Stage 2'
}

function hasSecurityCouncil(
  stage: GovernanceProjectEntry['stage'],
  multisig: GovernanceProjectEntry['multisig'],
): boolean {
  // Stage 1/2 can be reached without a Security Council (e.g. Aztec uses
  // probabilistic inclusion + exit window). Require both stage AND a
  // Council/Security-named multisig before labeling as Council.
  if (!isCouncilStage(stage)) return false
  if (!multisig) return false
  // Require "Security" in the name — standard L2BEAT Security Council
  // convention. Avoids matching scoped councils like "SlashVeto Council".
  return /security/i.test(multisig.name)
}

function securityRank(stage: GovernanceProjectEntry['stage']): number {
  // Higher = more decentralized — lets sort put Councils on top.
  if (stage === 'Stage 2') return 2
  if (stage === 'Stage 1') return 1
  return 0
}

function CustodyCell({
  stage,
  multisig,
}: {
  stage: GovernanceProjectEntry['stage']
  multisig: GovernanceProjectEntry['multisig']
}) {
  const isCouncil = hasSecurityCouncil(stage, multisig)
  const primary = isCouncil ? (
    <span className="flex items-center gap-1.5 font-medium">
      <GovernanceIcon className="size-4 stroke-primary" />
      Council
    </span>
  ) : (
    <span className="font-medium">Single entity</span>
  )
  // Only surface the multisig threshold when it actually belongs to a
  // Security Council — otherwise the number would misrepresent ops-only
  // multisigs (e.g. Aztec's 5/9 sequencer multisig).
  const threshold = isCouncil ? multisig?.threshold : undefined
  const secondary = isCouncil
    ? multisig?.breakdown
      ? threshold
        ? `${threshold} (${multisig.breakdown})`
        : multisig.breakdown
      : threshold
    : undefined
  return (
    <div className="flex flex-col items-start">
      {primary}
      {secondary && (
        <span className="text-2xs text-secondary">{secondary}</span>
      )}
    </div>
  )
}

function TxProcessingCell({
  proofSystem,
  challengePeriodSeconds,
}: {
  proofSystem: GovernanceProjectEntry['proofSystem']
  challengePeriodSeconds: GovernanceProjectEntry['challengePeriodSeconds']
}) {
  let primary: string
  let secondary: string | undefined

  if (!proofSystem) {
    primary = 'No proofs'
  } else if (proofSystem.type === 'Validity') {
    primary = 'Pre-audited'
  } else {
    primary = 'Attested'
    secondary = challengePeriodSeconds
      ? `Challengeable, ${formatSeconds(challengePeriodSeconds)}`
      : 'Challengeable'
  }

  return (
    <div className="flex flex-col items-start">
      <span className="font-medium">{primary}</span>
      {secondary && (
        <span className="text-2xs text-secondary">{secondary}</span>
      )}
    </div>
  )
}

// Stack-level defaults for the Tx cost column. Primary = fee-market
// mechanism pattern; secondary = who can change it on a typical chain of
// that stack. Per-slug overrides in TX_COST_OVERRIDES take precedence.
type TxCostLabel = { primary: string; secondary: string }

const TX_COST_STACK_DEFAULTS: Partial<Record<ProjectScalingStack, TxCostLabel>> = {
  // Every EIP-1559-compatible rollup is "Algorithmic" at the primary level;
  // the stack-specific story lives in the secondary (who moves the scalers).
  'OP Stack': { primary: 'Algorithmic', secondary: 'Team-controlled levers' },
  Arbitrum: { primary: 'Algorithmic', secondary: 'Team-controlled levers' },
  // ZK Stack chains each hold their own FeeParams in their own DiamondProxy;
  // chain admin is per-deployer (usually team-controlled). zkSync Era is
  // the exception where fee knobs genuinely route through the stack-level
  // ProtocolUpgradeHandler — pinned as a slug override below.
  'ZK Stack': { primary: 'Algorithmic', secondary: 'Team-controlled levers' },
  'ZKsync Lite': { primary: 'Algorithmic', secondary: 'Team-controlled levers' },
  'Agglayer CDK': { primary: 'Algorithmic', secondary: 'Team-controlled levers' },
  OVM: { primary: 'Algorithmic', secondary: 'Team-controlled levers' },
  'SN Stack': { primary: 'Algorithmic', secondary: 'Starknet governance' },
  Taiko: { primary: 'Algorithmic', secondary: 'Taiko governance' },
  // Operator-run rollups have no market mechanism; the operator dictates fees.
  StarkEx: { primary: 'Operator-set', secondary: 'Operator-set' },
  Loopring: { primary: 'Operator-set', secondary: 'Operator-set' },
  'Cartesi Rollups': { primary: 'Operator-set', secondary: 'Operator-set' },
}

// Per-slug overrides where the stack default doesn't apply (e.g. Arbitrum
// One is DAO-bounded, not team-controlled). Sourced from project docs and
// spot-checked against `packages/config/src/projects/<slug>/discovered.json`.
const TX_COST_OVERRIDES: Record<string, TxCostLabel> = {
  // Arbitrum One: ArbOwner reachable only via the L1 Timelock driven by the
  // Arbitrum DAO. Security Council can intervene but not unilaterally raise
  // user fees.
  arbitrum: { primary: 'Algorithmic', secondary: 'DAO-bounded' },
  // Optimism mainnet: SystemConfig.owner is OpFoundationUpgradeSafe (5/7
  // OP Foundation multisig) with no timelock. Scalars uint32, no cap.
  // (L2BEAT slug: op-mainnet.)
  'op-mainnet': { primary: 'Algorithmic', secondary: 'Team-controlled levers' },
  // Scroll: SystemConfig.updateMessageQueueParameters is routed through
  // ScrollOwner → TimelockSCEmergency (0s delay) → Security Council (9/12).
  // Functionally SC-instant; params are uint112 (type-bounded).
  scroll: { primary: 'Algorithmic', secondary: 'SC instant (9/12)' },
  // zkSync Era: the only ZK Stack chain whose fee knobs actually flow
  // through the stack-level ProtocolUpgradeHandler (DAO + SC + Guardians).
  'zksync-era': { primary: 'Algorithmic', secondary: 'ZK Stack governance' },
  // Linea: ConsenSys-built zkEVM without a formal stack tag. EIP-1559 fees,
  // Linea Security Council + team control parameter changes.
  linea: { primary: 'Algorithmic', secondary: 'Team-controlled levers' },
  // Morph: hybrid optimistic + ZK rollup, EIP-1559 style, team-upgradable.
  morph: { primary: 'Algorithmic', secondary: 'Team-controlled levers' },
  // Aztec Network: EIP-1559-style pricing denominated in "fee juice" (the
  // native fee asset); base and priority fees per mana, team-governed
  // parameters during mainnet beta.
  aztecnetwork: { primary: 'Algorithmic', secondary: 'Team-controlled levers' },
  // Aztec v1 (Aztec Connect): centralized operator posts rollups.
  aztecv1: { primary: 'Operator-set', secondary: 'Operator-set' },
  // Intmax: tx data delivered off-chain; only nullifier bytes land on L1.
  intmax: { primary: 'Off-chain', secondary: 'Operator-set' },
  // Lighter: perp DEX ZK rollup operated by the Lighter team.
  lighter: { primary: 'Operator-set', secondary: 'Operator-set' },
  // Facet: L2 tx bytes ride in L1 calldata; pricing is L1 gas directly.
  facet: { primary: 'L1 calldata', secondary: 'Ethereum-native' },
  // Ethscriptions: inscription protocol piggybacking on L1 calldata gas.
  ethscriptions: { primary: 'L1 calldata', secondary: 'Ethereum-native' },
}

function TxCostCell({
  slug,
  stack,
}: {
  slug: string
  stack: GovernanceProjectEntry['stack']
}) {
  const label =
    TX_COST_OVERRIDES[slug] ??
    (stack && TX_COST_STACK_DEFAULTS[stack]) ?? {
      primary: 'Unknown',
      secondary: '',
    }
  return (
    <div className="flex flex-col items-start">
      <span className="font-medium">{label.primary}</span>
      {label.secondary && (
        <span className="text-2xs text-secondary">{label.secondary}</span>
      )}
    </div>
  )
}

// Per-project privacy labels. Default is a transparent rollup: public
// calldata with pseudonymous addresses. Override entries below are sourced
// from project docs.
const PRIVACY_OVERRIDES: Record<string, { primary: string; secondary: string }> = {
  // Aztec private txs encrypt sender/receiver/amount via notes + nullifiers.
  // The "Tx fingerprint" (per-tx counts of note hashes, nullifiers, logs)
  // can leak which function was executed even though contents are hidden.
  // Source: Aztec docs — privacy_considerations (function/tx fingerprints).
  aztecnetwork: { primary: 'Private', secondary: 'Tx fingerprint' },
  // Intmax: stateless rollup; tx data delivered off-chain. Only ~4–5 byte
  // nullifiers + block roots land on L1, so per-tx shape is uniform — the
  // relevant privacy property is the size of the anonymity set.
  // Source: eprint.iacr.org/2023/1082 (Intmax2); docs.network.intmax.io.
  intmax: { primary: 'Private', secondary: 'Anonymity set' },
}

function PrivacyCell({ slug }: { slug: string }) {
  const label = PRIVACY_OVERRIDES[slug] ?? {
    primary: 'Public data',
    secondary: 'Pseudonymous',
  }
  return (
    <div className="flex flex-col items-start">
      <span className="font-medium">{label.primary}</span>
      <span className="text-2xs text-secondary">{label.secondary}</span>
    </div>
  )
}

const MECHANISM_RENAMES: Record<string, string> = {
  'Enqueue via L1': 'Blanket censorship',
  'Self sequence': 'Tx self processing',
}

function CensorshipCell({
  value,
}: {
  value: GovernanceProjectEntry['censorship']
}) {
  // Sentiment maps to censorship headline:
  //  good    -> users can always exit -> "None"
  //  warning -> partial protection    -> "Partial"
  //  bad     -> sequencer can censor  -> "Possible"
  const sentiment = value.sentiment ?? 'neutral'
  const headline =
    sentiment === 'good'
      ? 'None'
      : sentiment === 'warning'
        ? 'Partial'
        : sentiment === 'bad'
          ? 'Possible'
          : value.value

  const rawMechanism = headline === value.value ? undefined : value.value
  const mechanism = rawMechanism && MECHANISM_RENAMES[rawMechanism]
    ? MECHANISM_RENAMES[rawMechanism]
    : rawMechanism

  const cell = (
    <div className="flex flex-col items-start text-left">
      <SentimentText sentiment={sentiment} className="font-medium">
        {headline}
      </SentimentText>
      {mechanism && (
        <span className="text-2xs text-secondary">{mechanism}</span>
      )}
    </div>
  )

  if (!value.description) return cell

  return (
    <Tooltip>
      <TooltipTrigger disabledOnMobile className="h-[inherit]">
        {cell}
      </TooltipTrigger>
      <TooltipContent>{value.description}</TooltipContent>
    </Tooltip>
  )
}

function UpgradeCell({ entry }: { entry: GovernanceProjectEntry }) {
  const base = (
    <TableValueCell
      value={entry.upgrade}
      href={`/scaling/projects/${entry.slug}#permissions`}
    />
  )
  if (entry.upgraders.length === 0) return base

  return (
    <Tooltip>
      <TooltipTrigger disabledOnMobile className="h-[inherit]">
        {base}
      </TooltipTrigger>
      <TooltipContent>
        <div className="mb-1 font-medium">Upgraders</div>
        <ul className="flex list-none flex-col gap-0.5 text-2xs">
          {entry.upgraders.map((actor) => (
            <li key={`${actor.name}|${actor.delay}`}>
              <span className="font-medium">{actor.name}</span>
              <span className="text-secondary"> — {actor.delay}</span>
              {actor.unreachable && (
                <span className="text-secondary"> (unreachable)</span>
              )}
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  )
}
