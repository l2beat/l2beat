import type { ReactNode } from 'react'
import { CustomLink } from '~/components/link/CustomLink'
import { PRIVACY_EXPOSURE_CHIP_CLASS_NAME } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import {
  getCheckedAppSourceLabel,
  getReferenceAppCommit,
  getReferenceAppSince,
  REFERENCE_APP,
} from '~/pages/privacy/referenceAppUi'
import type { PrivacyReferenceApp } from '~/server/features/privacy/utils/getPrivacyReferenceApp'
import { cn } from '~/utils/cn'

const CHIPS = {
  reference: {
    label: REFERENCE_APP.referenceChip,
    className: PRIVACY_EXPOSURE_CHIP_CLASS_NAME.private,
  },
  checked: {
    label: REFERENCE_APP.checkedChip,
    className: PRIVACY_EXPOSURE_CHIP_CLASS_NAME.exposed,
  },
} as const

/** The reference app first, then the other apps checked against it. */
export function PrivacyReferenceApps({ app }: { app: PrivacyReferenceApp }) {
  const commit = app.source && getReferenceAppCommit(app.source)

  return (
    <div className="mt-4 flex flex-col gap-2">
      <span className="font-medium text-paragraph-12 text-secondary uppercase tracking-wide">
        {REFERENCE_APP.listTitle}
      </span>
      <ul className="divide-y divide-divider rounded-lg border border-divider">
        <AppRow
          iconUrl={app.iconUrl}
          name={app.name}
          href={app.url}
          version={app.version}
          chip="reference"
        >
          {getReferenceAppSince(app)}{' '}
          {commit ? (
            <>
              Commit <CustomLink href={commit.href}>{commit.label}</CustomLink>.
              {app.source?.partial && ` ${REFERENCE_APP.partialSource}`}
            </>
          ) : (
            'Closed source.'
          )}
        </AppRow>
        {app.checkedApps.map((checkedApp) => (
          <AppRow
            key={checkedApp.name}
            iconUrl={checkedApp.iconUrl}
            name={checkedApp.name}
            chip="checked"
            fix={checkedApp.fix}
          >
            {checkedApp.finding}{' '}
            <CustomLink href={checkedApp.source} className="whitespace-nowrap">
              {getCheckedAppSourceLabel(checkedApp)}
            </CustomLink>
          </AppRow>
        ))}
      </ul>
      <CustomLink
        href={REFERENCE_APP.methodologyHref}
        className="self-start text-paragraph-13"
      >
        {REFERENCE_APP.methodologyLink}
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
  fix,
  children,
}: {
  iconUrl: string
  name: string
  href?: string
  version?: string
  chip: keyof typeof CHIPS
  fix?: string
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
        {fix && (
          <p className="mt-1 text-paragraph-13 text-secondary md:text-paragraph-14">
            <span className="font-medium">{REFERENCE_APP.fixLabel}: </span>
            {fix}
          </p>
        )}
      </div>
    </li>
  )
}
