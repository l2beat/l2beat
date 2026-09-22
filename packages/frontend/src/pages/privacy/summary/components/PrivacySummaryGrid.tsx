import { CountBadge } from '~/components/badge/CountBadge'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TabInfoWithDrawer } from '~/components/TabInfoWithDrawer'
import {
  type TrustedSetupRisk,
  TrustedSetupRiskDot,
} from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { PrivacyRosetteIcon } from '../../rosette/PrivacyRosetteIcon'
import type {
  PrivacyRosetteGroups,
  PrivacyRosetteSlice,
} from '../../rosette/privacyRosetteSlices'
import { groupByPrivacyType } from '../privacySummaryViews'
import { PrivacySummaryTable } from './PrivacySummaryTable'

/**
 * V2: every kind of privacy at once, as a 2x2 grid of compact tables instead
 * of tabs. There are three kinds, so the fourth cell explains the rosette the
 * tables share.
 */
export function PrivacySummaryGrid({
  entries,
}: {
  entries: PrivacySummaryEntry[]
}) {
  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-2">
      {groupByPrivacyType(entries).map((group) => (
        <PrimaryCard key={group.field} className="flex min-w-0 flex-col">
          <h2 className="flex items-center gap-2 font-bold text-heading-20">
            {group.label}
            <CountBadge>{group.entries.length}</CountBadge>
          </h2>
          <div className="mt-2">
            <TabInfoWithDrawer
              title={group.title}
              content={group.description}
            />
          </div>
          <PrivacySummaryTable
            view="grid"
            entries={group.entries}
            hiddenColumns={group.hiddenColumns}
            compact
          />
        </PrimaryCard>
      ))}
      <RosetteGuide />
    </div>
  )
}

const EXAMPLE_ADVERSARIES: [string, TrustedSetupRisk][] = [
  ['Public observer', 'green'],
  ['Chain analyst', 'green'],
  ['Network observer', 'yellow'],
  ['Privileged insider', 'green'],
  ['Future adversary', 'red'],
]

const EXAMPLE_RISKS: [string, TrustedSetupRisk][] = [
  ['Trusted setup', 'yellow'],
  ['Exit window', 'green'],
  ['Reproducibility', 'green'],
]

const toExampleSlices = (
  items: [string, TrustedSetupRisk][],
): PrivacyRosetteSlice[] =>
  items.map(([label, risk]) => ({
    id: label,
    label,
    value: '',
    risk,
    source: { type: 'risk', description: '' },
  }))

const EXAMPLE_GROUPS: PrivacyRosetteGroups = {
  adversaries: { title: '', slices: toExampleSlices(EXAMPLE_ADVERSARIES) },
  risks: { title: '', slices: toExampleSlices(EXAMPLE_RISKS) },
}

const COLOUR_KEY: [TrustedSetupRisk, string][] = [
  ['green', 'Private, or low risk'],
  ['yellow', 'At risk, or only with care'],
  ['red', 'Exposed, or high risk'],
  ['None', 'Does not apply'],
]

function RosetteGuide() {
  return (
    <PrimaryCard className="flex flex-col">
      <h2 className="font-bold text-heading-20">How to read the rosette</h2>
      <p className="mt-2 text-secondary text-xs md:text-[13px]">
        Every protocol gets one rosette. Hover it in any table for the verdict
        behind each slice.
      </p>
      <div className="mt-4 flex flex-1 flex-col items-center gap-6 sm:flex-row">
        <PrivacyRosetteIcon
          groups={EXAMPLE_GROUPS}
          className="size-32 shrink-0"
          label="Example rosette"
        />
        <div className="flex flex-col gap-3 text-xs md:text-[13px]">
          <div>
            <div className="font-bold">Left half: privacy</div>
            <p className="text-secondary">
              One slice per adversary, top to bottom:{' '}
              {EXAMPLE_ADVERSARIES.map(([label]) => label.toLowerCase()).join(
                ', ',
              )}
              . Can a careful user stay private against it?
            </p>
          </div>
          <div>
            <div className="font-bold">Right half: protocol risks</div>
            <p className="text-secondary">
              Risks that apply whoever is watching:{' '}
              {EXAMPLE_RISKS.map(([label]) => label.toLowerCase()).join(', ')}.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
            {COLOUR_KEY.map(([risk, text]) => (
              <li key={risk} className="flex items-center gap-1.5">
                <TrustedSetupRiskDot risk={risk} size="xs" />
                <span className="text-secondary">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PrimaryCard>
  )
}
