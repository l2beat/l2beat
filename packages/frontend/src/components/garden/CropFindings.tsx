import type { OsiLicense, ResolvedCropEvaluation } from '@l2beat/config'
import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

/** Shared by the garden tooltip and the project page, so the two cannot drift. */
export function CropFindings({
  evaluation,
}: {
  evaluation: ResolvedCropEvaluation
}) {
  return (
    <>
      <CropSection
        title="What's good"
        items={evaluation.points}
        license={evaluation.license}
      />
      <CropSection title="What is missing" items={evaluation.missing} />
      <CropSection
        title="Additional considerations"
        items={evaluation.additionalConsiderations}
      />
      <CropSection title="Not reviewed yet" items={evaluation.notReviewed} />
    </>
  )
}

/** The standing caveat for a crop - see `CropDefinition.note`. */
export function CropNote({
  note,
  className,
}: {
  note: string | undefined
  className?: string
}) {
  if (!note) {
    return null
  }
  return <p className={cn('mt-1.5 text-secondary', className)}>{note}</p>
}

function CropSection({
  title,
  items,
  license,
}: {
  title: string
  items: string[]
  /** Rendered as the first bullet. */
  license?: OsiLicense | undefined
}) {
  if (!license && items.length === 0) {
    return null
  }
  return (
    <>
      <p className="mt-2.5 font-semibold text-[10px] text-secondary uppercase tracking-wider">
        {title}
      </p>
      <ul className="mt-1 flex flex-col gap-1">
        {license && (
          <CropBullet>
            <CropLicenseText license={license} />
          </CropBullet>
        )}
        {items.map((item) => (
          <CropBullet key={item}>{item}</CropBullet>
        ))}
      </ul>
    </>
  )
}

function CropLicenseText({ license }: { license: OsiLicense }) {
  return (
    <>
      {'License: '}
      <a
        href={license.url}
        target="_blank"
        rel="noreferrer noopener"
        className="text-link underline"
      >
        {license.name}
      </a>
      <span className="text-secondary">{` (${license.spdxId}, OSI approved)`}</span>
    </>
  )
}

function CropBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2 text-primary">
      <span
        aria-hidden
        className="mt-[7px] size-1 shrink-0 rounded-full bg-current opacity-50"
      />
      <span>{children}</span>
    </li>
  )
}
