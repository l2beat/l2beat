import type { ReactNode } from 'react'
import { CustomLink } from '~/components/link/CustomLink'
import { PRIVACY_EXPOSURE_CHIP_CLASS_NAME } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { REFERENCE_APP } from '~/pages/privacy/referenceAppUi'
import type { PrivacyReferenceApp } from '~/server/features/privacy/utils/getPrivacyReferenceApp'
import { cn } from '~/utils/cn'

const CHIPS = {
  reference: {
    label: 'Reference',
    className: PRIVACY_EXPOSURE_CHIP_CLASS_NAME.private,
  },
  leaksMore: {
    label: 'Leaks more',
    className: PRIVACY_EXPOSURE_CHIP_CLASS_NAME.exposed,
  },
} as const

/** The reference app first, then the other apps checked against it. */
export function PrivacyReferenceApps({ app }: { app: PrivacyReferenceApp }) {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <span className="font-medium text-paragraph-12 text-secondary uppercase tracking-wide">
        Apps
      </span>
      <ul className="divide-y divide-divider rounded-lg border border-divider">
        <AppRow
          iconUrl={app.iconUrl}
          name={app.name}
          href={app.url}
          version={app.version}
          chip="reference"
        >
          The ratings have assumed this app since {app.since}.{' '}
          {app.source ? (
            <>
              Commit{' '}
              <CustomLink
                href={`${app.source.repository}/tree/${app.source.commit}`}
              >
                {app.source.commit.slice(0, 7)}
              </CustomLink>
              .
            </>
          ) : (
            'Closed source.'
          )}
        </AppRow>
        {app.alternatives.map((alternative) => (
          <AppRow
            key={alternative.name}
            iconUrl={alternative.iconUrl}
            name={alternative.name}
            chip="leaksMore"
          >
            {alternative.finding}{' '}
            <CustomLink href={alternative.source} className="whitespace-nowrap">
              {alternative.checked
                ? `Source (checked ${alternative.checked})`
                : 'Source'}
            </CustomLink>
          </AppRow>
        ))}
      </ul>
      <CustomLink
        href={REFERENCE_APP.methodologyHref}
        className="self-start text-paragraph-13"
      >
        How an app becomes the reference
      </CustomLink>
    </div>
  )
}

function AppRow({
  iconUrl,
  name,
  href,
  version,
  chip,
  children,
}: {
  iconUrl: string
  name: string
  href?: string
  version?: string
  chip: keyof typeof CHIPS
  children: ReactNode
}) {
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <img src={iconUrl} alt="" className="mt-0.5 size-6 shrink-0 rounded-sm" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {href ? (
            <CustomLink href={href} className="font-bold">
              {name}
            </CustomLink>
          ) : (
            <span className="font-bold">{name}</span>
          )}
          {version && (
            <span className="text-paragraph-13 text-secondary">v{version}</span>
          )}
          <span
            className={cn(
              'inline-flex select-none items-center rounded border px-1.5 py-0.5 font-medium text-2xs uppercase',
              CHIPS[chip].className,
            )}
          >
            {CHIPS[chip].label}
          </span>
        </div>
        <p className="mt-0.5 text-paragraph-14 md:text-paragraph-15">
          {children}
        </p>
      </div>
    </li>
  )
}
