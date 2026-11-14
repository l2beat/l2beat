import type {
  PrivacyAdversaryCell,
  PrivacyExposureMap,
  PrivacyFieldInfo,
  ProjectPrivacyAdversaries,
} from '@l2beat/config'
import isEqual from 'lodash/isEqual'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CustomLink } from '~/components/link/CustomLink'
import { BigPizzaRosette } from '~/components/rosette/pizza/BigPizzaRosette'
import type { RosetteValue } from '~/components/rosette/types'
import {
  getExposure,
  getExposureNote,
  getPrivacyAdversaryBlockId,
  getPrivacyAdversaryDescription,
  getPrivacyAdversarySectionRosetteValue,
  PRIVACY_ADVERSARIES_TOOLTIP,
  PRIVACY_CHIP_BASE_CLASS_NAME,
  PRIVACY_EXPOSURE_CHIP_CLASS_NAME,
  PRIVACY_EXPOSURE_LABEL,
  PRIVACY_INTERIOR_LABEL,
} from '~/pages/privacy/adversaries/privacyAdversaryUi'
import {
  ADVICE,
  getAdviceStepId,
  getStepsAgainst,
} from '~/pages/privacy/adviceUi'
import type { PrivacyReferenceApp } from '~/server/features/privacy/utils/getPrivacyReferenceApp'
import { cn } from '~/utils/cn'
import { RiskBanner } from '../../RiskBanner'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { PrivacyReferenceApps } from './PrivacyReferenceApps'

export interface PrivacyAdversariesSectionProps extends ProjectSectionProps {
  /** Sources already resolved to urls, see resolvePrivacySources. */
  adversaries: ProjectPrivacyAdversaries
  referenceApp?: PrivacyReferenceApp
}

export function PrivacyAdversariesSection({
  adversaries,
  referenceApp,
  ...sectionProps
}: PrivacyAdversariesSectionProps) {
  const baseline = adversaries.cells.publicObserver
  const blocks = adversaries.adversaries.map((adversary) => {
    const cell = adversaries.cells[adversary.id]
    return {
      id: adversary.id,
      cell,
      value: getPrivacyAdversarySectionRosetteValue(adversary, cell),
    }
  })

  return (
    <ProjectSection {...sectionProps}>
      <p className="text-paragraph-15 md:text-paragraph-16">
        <span className="font-medium">What the protocol promises: </span>
        {adversaries.promise.text}
      </p>
      {referenceApp && <PrivacyReferenceApps app={referenceApp} />}
      <p className="mt-2 text-paragraph-13 text-secondary md:text-paragraph-14">
        {PRIVACY_ADVERSARIES_TOOLTIP} Fields marked{' '}
        <span className="font-medium">at risk</span> stay private only under the
        condition in their note.
      </p>
      {adversaries.advice && (
        <p className="mt-2 text-paragraph-15 md:text-paragraph-16">
          <span className="font-medium">{ADVICE.label}: </span>
          <CustomLink href={`#${ADVICE.sectionId}`}>{ADVICE.title}</CustomLink>
        </p>
      )}
      <div className="flex justify-center">
        <BigPizzaRosette
          values={blocks.map((block) => block.value)}
          isUnderReview={sectionProps.isUnderReview}
          className="my-6"
        />
      </div>
      <div className="flex flex-col gap-8">
        {blocks.map((block) => (
          <AdversaryBlock
            key={block.id}
            value={block.value}
            cell={block.cell}
            baseline={block.id === 'publicObserver' ? undefined : baseline}
            fields={adversaries.fields}
            steps={getStepsAgainst(adversaries.advice, block.id)}
          />
        ))}
      </div>
    </ProjectSection>
  )
}

function AdversaryBlock({
  value,
  cell,
  baseline,
  fields,
  steps,
}: {
  /** The adversary's rosette slice. */
  value: RosetteValue
  cell: PrivacyAdversaryCell
  /** The advice steps that defend this cell. */
  steps: ReturnType<typeof getStepsAgainst>
  /** The public observer cell; undefined when rendering the baseline itself. */
  baseline: PrivacyAdversaryCell | undefined
  fields: PrivacyFieldInfo[]
}) {
  return (
    <div
      id={getPrivacyAdversaryBlockId(cell.id)}
      className="flex scroll-mt-section-nav-card flex-col gap-3"
    >
      <RiskBanner
        {...value}
        // The reason for the colour leads in bold, what follows extends it.
        description={
          cell.exposureContinued
            ? `**${cell.exposureShort}** ${cell.exposureContinued}`
            : getPrivacyAdversaryDescription(cell)
        }
        size="large"
      />
      {/* One value column for every row, like "Against:" in the advice steps. */}
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 gap-y-2 text-paragraph-13">
        {cell.interior &&
          (baseline?.interior ? (
            <ExposureDiff
              interior={cell.interior}
              baseline={baseline.interior}
              fields={fields}
            />
          ) : (
            <ExposureRow map={cell.interior} fields={fields} />
          ))}
        {steps.length > 0 && (
          <>
            <dt>{ADVICE.label}:</dt>
            <dd className="flex flex-wrap gap-x-4 gap-y-1">
              {steps.map(({ step, index }) => (
                // Only the name is underlined: a flex child inherits the
                // link's decoration, so the badge would get it too.
                <CustomLink
                  key={step.name}
                  href={`#${getAdviceStepId(index)}`}
                  underline={false}
                  className="inline-flex items-baseline gap-1.5"
                >
                  <span className="flex size-5 items-center justify-center self-center rounded-full bg-surface-tertiary font-bold text-label-value-12 text-primary">
                    {index + 1}
                  </span>
                  <span className="underline">{step.name}</span>
                </CustomLink>
              ))}
            </dd>
          </>
        )}
        {cell.sources && cell.sources.length > 0 && (
          <>
            <dt>Sources:</dt>
            <dd className="flex flex-wrap gap-x-4 gap-y-1">
              {cell.sources.map(
                (source, i) =>
                  'url' in source && (
                    <CustomLink key={i} href={source.url}>
                      {source.title}
                    </CustomLink>
                  ),
              )}
            </dd>
          </>
        )}
      </dl>
    </div>
  )
}

/** Only the interior fields whose verdict or note differs from the public observer. */
function ExposureDiff({
  interior,
  baseline,
  fields,
}: {
  interior: PrivacyExposureMap
  baseline: PrivacyExposureMap
  fields: PrivacyFieldInfo[]
}) {
  const changed = fields.filter(
    (field) => !isEqual(interior[field.id], baseline[field.id]),
  )

  if (changed.length === 0) {
    return (
      <>
        <dt>{PRIVACY_INTERIOR_LABEL}:</dt>
        <dd className="text-secondary">The same as for a public observer.</dd>
      </>
    )
  }

  return (
    <>
      <dt className="col-span-2 font-medium text-label-value-13">
        Compared with a public observer
      </dt>
      <ExposureRow map={interior} fields={changed} />
    </>
  )
}

function ExposureRow({
  map,
  fields,
}: {
  map: PrivacyExposureMap
  fields: PrivacyFieldInfo[]
}) {
  return (
    <>
      <dt>{PRIVACY_INTERIOR_LABEL}:</dt>
      <dd className="flex flex-wrap gap-1.5">
        {fields.map((field) => {
          const leak = map[field.id]
          const verdict = getExposure(leak)
          const note = getExposureNote(leak)
          return (
            <Tooltip key={field.id}>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    PRIVACY_CHIP_BASE_CLASS_NAME,
                    PRIVACY_EXPOSURE_CHIP_CLASS_NAME[verdict],
                  )}
                >
                  {field.label}
                  <span className="font-normal">
                    {PRIVACY_EXPOSURE_LABEL[verdict]}
                  </span>
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-[320px]">
                <p className="font-medium">{field.description}</p>
                {note && <p className="mt-1">{note}</p>}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </dd>
    </>
  )
}
