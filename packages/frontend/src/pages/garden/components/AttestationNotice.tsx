import { formatTimestamp } from '~/utils/dates'
import { SproutIcon } from './SproutIcon'

export interface GardenAttestation {
  revision: number
  reviewedAt: number
  /** The reviewed set, not the garden: a project with a red crop is attested but not planted. */
  projectCount: number
  explorerUrl: string
}

export function AttestationNotice({
  attestation,
}: {
  attestation: GardenAttestation | undefined
}) {
  if (!attestation) {
    return null
  }
  return (
    <div className="mt-4 flex flex-col gap-2 rounded-xl border border-garden-border bg-surface-primary/70 p-4 max-md:mx-4 md:mt-6 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
      <div className="flex items-start gap-3 md:items-center">
        <SproutIcon className="mt-0.5 size-4 shrink-0 text-garden-accent md:mt-0" />
        <p className="text-paragraph-14 md:text-paragraph-15">
          <span className="font-bold">Every review is attested onchain.</span>{' '}
          <span className="text-secondary">
            Revision {attestation.revision} covers {attestation.projectCount}{' '}
            reviewed projects, as of{' '}
            {formatTimestamp(attestation.reviewedAt, { mode: 'date' })}.
          </span>
        </p>
      </div>
      <a
        href={attestation.explorerUrl}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 font-semibold text-paragraph-14 underline underline-offset-2 hover:no-underline"
      >
        View the attestation
      </a>
    </div>
  )
}
