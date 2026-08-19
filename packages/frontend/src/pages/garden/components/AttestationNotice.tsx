import { formatTimestamp } from '~/utils/dates'
import { SproutIcon } from './SproutIcon'

export interface GardenAttestation {
  uid: string
  revision: number
  reviewedAt: number
  projectCount: number
  explorerUrl: string
}

/**
 * The onchain counterpart of the table above it. One attestation names every
 * project in the garden, so this is a single link rather than one per row.
 */
export function AttestationNotice({
  attestation,
}: {
  attestation: GardenAttestation | undefined
}) {
  if (!attestation) {
    return null
  }
  return (
    <div className="mt-4 flex flex-col gap-2 rounded-xl border border-[#cfe3c0] bg-surface-primary/70 p-4 max-md:mx-4 md:mt-6 md:flex-row md:items-center md:justify-between md:px-6 md:py-4 dark:border-[#2c3a22]">
      <div className="flex items-start gap-3 md:items-center">
        <SproutIcon className="mt-0.5 size-4 shrink-0 text-[#4a7a35] md:mt-0 dark:text-[#8fd06a]" />
        <p className="text-paragraph-14 md:text-paragraph-15">
          <span className="font-bold">
            These {attestation.projectCount} projects are attested onchain.
          </span>{' '}
          <span className="text-secondary">
            Revision {attestation.revision}, reviewed{' '}
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
