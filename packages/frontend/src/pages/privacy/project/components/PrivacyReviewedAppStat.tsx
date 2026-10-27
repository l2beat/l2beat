import type { ProjectPrivacyReferenceClient } from '@l2beat/config'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import {
  getCheckedAppsCount,
  getReviewedAppLabel,
  REVIEWED_APP,
} from '../../reviewedAppUi'

interface Props {
  app: ProjectPrivacyReferenceClient
  /** The privacy section, which names the commit and the other apps. */
  href: string
}

export function PrivacyReviewedAppStat({ app, href }: Props) {
  const checked = getCheckedAppsCount(app)
  const notes = [
    ...(app.source ? [] : ['closed source']),
    ...(checked ? [`most private of ${checked} checked`] : []),
  ]

  return (
    <ProjectSummaryStat
      title={REVIEWED_APP.title}
      tooltip={REVIEWED_APP.tooltip}
      valueClassName="flex flex-col gap-0.5 max-md:items-end"
      value={
        <>
          <a href={href} className="hover:underline">
            {getReviewedAppLabel(app)}
          </a>
          {notes.length > 0 && (
            <span className="font-medium text-paragraph-12 text-secondary">
              {notes.join(', ')}
            </span>
          )}
        </>
      }
    />
  )
}
