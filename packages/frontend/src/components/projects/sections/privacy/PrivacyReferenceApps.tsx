import { Fragment, type ReactNode } from 'react'
import { CustomLink } from '~/components/link/CustomLink'
import { CustomLinkIcon } from '~/icons/Outlink'
import { PRIVACY_EXPOSURE_CHIP_CLASS_NAME } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import {
  getCheckedAppSourceLabel,
  getReferenceAppSince,
  getReferenceAppSource,
  REFERENCE_APP,
} from '~/pages/privacy/referenceAppUi'
import type { PrivacyReferenceApp } from '~/server/features/privacy/utils/getPrivacyReferenceApp'
import { cn } from '~/utils/cn'

const CHIPS = {
  // Neutral, since green would read as a privacy verdict the app may not earn.
  reference: {
    label: REFERENCE_APP.referenceChip,
    className:
      'border-[#CCDBFF] bg-[#D5E5F1] text-secondary dark:border-[#1B3C54] dark:bg-[#192E3C]',
  },
  checked: {
    label: REFERENCE_APP.checkedChip,
    className: PRIVACY_EXPOSURE_CHIP_CLASS_NAME.exposed,
  },
} as const

/** The reference app first, then the other apps checked against it. */
export function PrivacyReferenceApps({ app }: { app: PrivacyReferenceApp }) {
  const source = getReferenceAppSource(app)

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-medium text-paragraph-12 text-secondary uppercase tracking-wide">
          {REFERENCE_APP.listTitle}
        </span>
        <CustomLink
          href={REFERENCE_APP.methodologyHref}
          className="text-paragraph-13"
        >
          {REFERENCE_APP.methodologyLink}
        </CustomLink>
      </div>
      <ul className="divide-y divide-divider rounded-lg border border-divider">
        <AppRow
          iconUrl={app.iconUrl}
          name={app.name}
          href={app.url}
          version={app.version}
          chip="reference"
        >
          <Meta
            parts={[
              getReferenceAppSince(app),
              source.commit ? (
                <>
                  {source.label}{' '}
                  <CustomLink href={source.commit.href}>
                    {source.commit.label}
                  </CustomLink>
                </>
              ) : (
                source.label
              ),
            ]}
          />
        </AppRow>
        {app.checkedApps.map((checkedApp) => (
          <AppRow
            key={checkedApp.name}
            iconUrl={checkedApp.iconUrl}
            name={checkedApp.name}
            chip="checked"
          >
            <p className="text-paragraph-14 md:text-paragraph-15">
              {checkedApp.finding}
            </p>
            <Meta
              parts={[
                checkedApp.fix && (
                  <>
                    <span className="font-medium">
                      {REFERENCE_APP.fixLabel}:
                    </span>{' '}
                    {checkedApp.fix}
                  </>
                ),
                <CustomLink
                  key="source"
                  href={checkedApp.source}
                  className="whitespace-nowrap"
                >
                  {getCheckedAppSourceLabel(checkedApp)}
                </CustomLink>,
              ]}
            />
          </AppRow>
        ))}
      </ul>
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
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {href ? (
            <CustomLink
              href={href}
              variant="plain"
              underline={false}
              className="inline-flex items-center gap-0.5 font-bold hover:underline"
            >
              {name}
              <CustomLinkIcon className="size-3.5 fill-current" />
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
        {children}
      </div>
    </li>
  )
}

/** Secondary details on one line, separated by dots. */
function Meta({ parts }: { parts: ReactNode[] }) {
  return (
    <p className="text-paragraph-13 text-secondary md:text-paragraph-14">
      {parts.filter(Boolean).map((part, i) => (
        <Fragment key={i}>
          {i > 0 && ' · '}
          {part}
        </Fragment>
      ))}
    </p>
  )
}
