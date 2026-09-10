import type {
  PrivacyAdversary,
  PrivacyAdversaryCell,
  PrivacyExposureMap,
  PrivacyFieldInfo,
  PrivacySource,
  ProjectPrivacyAdversaries,
} from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CustomLink } from '~/components/link/CustomLink'
import {
  getExposure,
  getExposureNote,
  getPrivacyAdversaryAnchor,
  PRIVACY_ADVERSARIES_TOOLTIP,
  PRIVACY_EXPOSURE_CLASS_NAME,
  PRIVACY_EXPOSURE_LABEL,
  PRIVACY_INTERIOR_LABEL,
} from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { sentimentToRiskDot } from '~/pages/privacy/sentimentToRiskDot'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import { cn } from '~/utils/cn'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyAdversariesSectionProps extends ProjectSectionProps {
  adversaries: ProjectPrivacyAdversaries
}

const SECTION_TITLE = {
  permissions: 'Permissions',
  verifiers: 'Verifier IDs',
  'trusted-setups': 'Trusted setup',
  'upgrades-and-governance': 'Upgrades & Governance',
} as const

/** Contract and section sources point at anchors on this page. */
function resolveSource(source: PrivacySource): { title: string; href: string } {
  if ('url' in source) return { title: source.title, href: source.url }
  if ('contract' in source) {
    return {
      title: source.title ?? source.contract,
      href: `#${source.contract}`,
    }
  }
  return {
    title: source.title ?? SECTION_TITLE[source.section],
    href: `#${source.section}`,
  }
}

export function PrivacyAdversariesSection({
  adversaries,
  ...sectionProps
}: PrivacyAdversariesSectionProps) {
  const baseline = adversaries.cells.publicObserver

  return (
    <ProjectSection {...sectionProps}>
      <p className="text-paragraph-15 md:text-paragraph-16">
        <span className="font-medium">What the protocol promises: </span>
        {adversaries.promise.text}
      </p>
      <p className="mt-2 text-paragraph-13 text-secondary md:text-paragraph-14">
        {PRIVACY_ADVERSARIES_TOOLTIP} Fields marked{' '}
        <span className="font-medium">at risk</span> stay private only under the
        condition in their note.
      </p>
      <div className="mt-6 flex flex-col gap-8">
        {adversaries.adversaries.map((adversary) => (
          <AdversaryBlock
            key={adversary.id}
            adversary={adversary}
            cell={adversaries.cells[adversary.id]}
            baseline={adversary.id === 'publicObserver' ? undefined : baseline}
            fields={adversaries.fields}
          />
        ))}
      </div>
    </ProjectSection>
  )
}

function AdversaryBlock({
  adversary,
  cell,
  baseline,
  fields,
}: {
  adversary: PrivacyAdversary
  cell: PrivacyAdversaryCell
  /** The public observer cell; undefined when rendering the baseline itself. */
  baseline: PrivacyAdversaryCell | undefined
  fields: PrivacyFieldInfo[]
}) {
  return (
    <div
      id={getPrivacyAdversaryAnchor(adversary.id)}
      className="flex scroll-mt-24 flex-col gap-3"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <TrustedSetupRiskDot
          risk={sentimentToRiskDot(cell.sentiment)}
          size="sm"
          className="shrink-0"
        />
        <Tooltip>
          <TooltipTrigger className="font-bold text-paragraph-16 md:text-paragraph-18">
            {adversary.label}
          </TooltipTrigger>
          <TooltipContent className="max-w-[320px]">
            <p>{adversary.description}</p>
            <p className="mt-1 text-secondary text-xs">
              Examples: {adversary.examples}
            </p>
          </TooltipContent>
        </Tooltip>
        <span className="font-medium text-paragraph-15 md:text-paragraph-16">
          {cell.value}
        </span>
      </div>
      <p className="text-paragraph-15 md:text-paragraph-16">{cell.exposure}</p>
      {cell.advice && (
        <p className="text-paragraph-15 md:text-paragraph-16">
          <span className="font-medium">How to keep it private: </span>
          {cell.advice}
        </p>
      )}
      {cell.interior &&
        (baseline?.interior ? (
          <ExposureDiff
            interior={cell.interior}
            baseline={baseline.interior}
            fields={fields}
          />
        ) : (
          <ExposureChips map={cell.interior} fields={fields} />
        ))}
      {cell.sources && cell.sources.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-paragraph-13">
          <span className="text-secondary">Sources:</span>
          {cell.sources.map((source) => {
            const link = resolveSource(source)
            return (
              <CustomLink key={link.href} href={link.href}>
                {link.title}
              </CustomLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Only the interior fields whose verdict differs from the public observer. */
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
    (field) =>
      getExposure(interior[field.id]) !== getExposure(baseline[field.id]),
  )

  if (changed.length === 0) {
    return (
      <p className="text-paragraph-13 text-secondary italic">
        Learns nothing beyond the public observer.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="font-medium text-paragraph-12 text-secondary uppercase tracking-wide">
        Compared with a public observer
      </span>
      <ExposureChips map={interior} fields={changed} />
    </div>
  )
}

function ExposureChips({
  map,
  fields,
}: {
  map: PrivacyExposureMap
  fields: PrivacyFieldInfo[]
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-paragraph-12 text-secondary">
        {PRIVACY_INTERIOR_LABEL}
      </span>
      {fields.map((field) => {
        const leak = map[field.id]
        const verdict = getExposure(leak)
        const note = getExposureNote(leak)
        const chip = (
          <span
            className={cn(
              'inline-flex select-none items-center gap-1 rounded border px-1.5 py-0.5 font-medium text-xs',
              PRIVACY_EXPOSURE_CLASS_NAME[verdict],
            )}
          >
            {field.label}
            <span className="font-normal opacity-80">
              {PRIVACY_EXPOSURE_LABEL[verdict]}
            </span>
          </span>
        )
        return (
          <Tooltip key={field.id}>
            <TooltipTrigger asChild>{chip}</TooltipTrigger>
            <TooltipContent className="max-w-[320px]">
              <p className="font-medium">{field.description}</p>
              {note && <p className="mt-1">{note}</p>}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
