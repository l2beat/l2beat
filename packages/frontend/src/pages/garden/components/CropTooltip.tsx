import type { ReactNode } from 'react'
import {
  TooltipFootnote,
  TooltipHeader,
  TooltipRow,
} from '~/components/core/tooltip/TooltipParts'
import { CropBullet } from '~/components/garden/CropFindings'
import { CROP_TITLE } from '~/components/garden/cropPalette'
import {
  type CropEntry,
  type CropKey,
  getCropStatusText,
} from '~/components/garden/crops'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { ClockIcon } from '~/icons/Clock'
import { InfoIcon } from '~/icons/Info'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { cn } from '~/utils/cn'
import { CROP_CRITERIA } from '../cropCriteria'
import type { GardenEntry } from '../getGardenData'

/**
 * What a plant in the garden explains: the verdict and what it means for this
 * project, then whether the review lists anything more. The findings
 * themselves are on the project page. Other sections are flagged without
 * counting their bullets, since how a review splits its findings says
 * nothing about the project.
 */
export function CropTooltip({
  crop,
  project,
}: {
  crop: CropEntry
  project: GardenEntry
}) {
  const { definition, evaluation } = crop
  const { missing, additionalConsiderations, notReviewed, license } = evaluation
  const meaning = getVerdictMeaning(crop)
  const ossificationScore =
    definition.key === 'security' ? project.ossificationScore : undefined
  return (
    <div className="flex flex-col gap-3">
      <div>
        <TooltipHeader
          label={
            <span className="flex flex-col">
              <span>{definition.label}</span>
              {/* On phones the tooltip covers the row. */}
              <span className="font-medium text-label-value-12">
                {project.name}
              </span>
            </span>
          }
          value={
            <span
              className={cn(
                'font-semibold text-label-value-14 uppercase',
                CROP_TITLE[evaluation.sentiment],
              )}
            >
              {getCropStatusText(evaluation.status, evaluation.sentiment)}
            </span>
          }
        />
        {meaning && <p className="mt-2 text-pretty">{meaning}</p>}
        {/* Straight under the claim it qualifies, so only when there is one. */}
        {definition.shortNote && evaluation.status !== 'notReviewed' && (
          <TooltipFootnote className="mt-1">
            {definition.shortNote}
          </TooltipFootnote>
        )}
      </div>
      {missing.length > 0 && (
        <div>
          <Flag
            icon={<RoundedWarningIcon sentiment="warning" className="size-4" />}
          >
            What is missing
          </Flag>
          <ul className="mt-1 flex flex-col gap-1 pl-6">
            {missing.map((item) => (
              <CropBullet key={item}>{item}</CropBullet>
            ))}
          </ul>
        </div>
      )}
      {(additionalConsiderations.length > 0 || notReviewed.length > 0) && (
        <div className="flex flex-col gap-1.5">
          {additionalConsiderations.length > 0 && (
            <Flag icon={<InfoIcon className="size-4 fill-link" />}>
              Has additional considerations
            </Flag>
          )}
          {notReviewed.length > 0 && (
            <Flag
              icon={
                <ClockIcon className="size-4 text-secondary [&_path]:stroke-current" />
              }
            >
              Parts not reviewed yet
            </Flag>
          )}
        </div>
      )}
      {(license || ossificationScore) && (
        <div className="flex flex-col gap-1.5">
          {license && (
            <TooltipRow label="OSI-approved license">
              <a
                href={license.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-link underline"
              >
                {license.spdxId}
              </a>
            </TooltipRow>
          )}
          {ossificationScore && (
            <TooltipRow label="Ossification score">
              {ossificationScore}
            </TooltipRow>
          )}
        </div>
      )}
      {project.href && (
        <a
          href={`${project.href}#crops`}
          className="inline-flex items-center gap-1 self-start font-medium text-link text-paragraph-13 hover:underline"
        >
          Read the full review
          <ArrowRightIcon className="size-3 fill-current" />
        </a>
      )}
    </div>
  )
}

/**
 * A good verdict in one sentence per crop. Censorship resistance, Privacy and
 * Security describe what we checked rather than promise an outcome: a
 * permission model cannot rule out censorship by Ethereum itself, a future
 * break of today's cryptography can weaken privacy, and a security review is
 * not a guarantee.
 */
const GOOD_MEANING: Record<CropKey, string> = {
  censorshipResistance:
    'Users can use the protocol and withdraw without approval from its team, operators or governance.',
  openSource: CROP_CRITERIA.openSource.summary,
  privacy:
    'Privacy is enforced by cryptography, not by policy: no provider, list or approval decides who gets it.',
  security:
    'It passes our checks on upgrade safeguards and external dependencies.',
}

/**
 * What the verdict says about this project, in the words of the legend and
 * the criteria below the table. A verdict is scoped to what the review
 * covered, so it never reads as more than the review shows.
 */
function getVerdictMeaning({ definition, evaluation }: CropEntry) {
  if (evaluation.status === 'notReviewed') {
    return 'We have not reviewed this property yet.'
  }
  if (evaluation.status === 'fullyTransparent') {
    return 'The protocol makes no privacy claims. Its onchain activity is public.'
  }
  const scope = (claim: string) =>
    evaluation.status === 'partiallyReviewed' ||
    evaluation.notReviewed.length > 0
      ? `In the parts we reviewed, ${claim.charAt(0).toLowerCase()}${claim.slice(1)}`
      : claim
  switch (evaluation.sentiment) {
    case 'good': {
      const claim = scope(GOOD_MEANING[definition.key])
      return evaluation.missing.length > 0
        ? `${claim} The review also lists a gap below.`
        : claim
    }
    case 'warning':
      return scope('The property mostly holds, but something is missing.')
    case 'bad':
      return 'The property does not hold in practice.'
    default:
      return undefined
  }
}

function Flag({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-medium">
      <span aria-hidden className="flex size-4 shrink-0">
        {icon}
      </span>
      {children}
    </p>
  )
}
