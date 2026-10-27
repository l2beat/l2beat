import type { ProjectPrivacyReferenceClient } from '@l2beat/config'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { CustomLink } from '~/components/link/CustomLink'
import { ChevronIcon } from '~/icons/Chevron'
import {
  getCheckedAppsCount,
  REVIEWED_APP,
} from '~/pages/privacy/reviewedAppUi'

/** The app the ratings assume, and the other apps it was compared with. */
export function PrivacyReviewedApp({
  app,
}: {
  app: ProjectPrivacyReferenceClient
}) {
  const checked = getCheckedAppsCount(app)

  return (
    <div className="mt-2 flex flex-col gap-2">
      <p className="text-paragraph-15 md:text-paragraph-16">
        <span className="font-medium">{REVIEWED_APP.title}: </span>
        <CustomLink href={app.url}>{app.name}</CustomLink>
        {app.version && ` v${app.version}`}
        {app.source ? (
          <>
            , commit{' '}
            <CustomLink
              href={`${app.source.repository}/tree/${app.source.commit}`}
            >
              {app.source.commit.slice(0, 7)}
            </CustomLink>
          </>
        ) : (
          ', closed source'
        )}
        . The ratings assume this app
        {checked && `, the most private of ${checked} apps we checked`}.
      </p>
      {app.alternatives && app.alternatives.length > 0 && (
        <Collapsible className="group rounded-lg border border-divider">
          <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 font-medium text-paragraph-14">
            Checked, not rated ({app.alternatives.length})
            <ChevronIcon className="group-data-[state=open]:-rotate-180 size-4 fill-secondary transition-transform duration-300" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="flex flex-col gap-2 px-4 pb-3 text-paragraph-14">
              {app.alternatives.map((alternative) => (
                <li key={alternative.name}>
                  <span className="font-medium">{alternative.name}: </span>
                  {alternative.finding}{' '}
                  <CustomLink
                    href={alternative.source}
                    className="whitespace-nowrap"
                  >
                    {alternative.checked
                      ? `Source (checked ${alternative.checked})`
                      : 'Source'}
                  </CustomLink>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
