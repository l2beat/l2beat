import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import type { PrivacyReferenceApp } from '~/server/features/privacy/utils/getPrivacyReferenceApp'
import {
  getReferenceAppLabel,
  getReferenceAppNotes,
  REFERENCE_APP,
} from '../../referenceAppUi'

interface Props {
  app: PrivacyReferenceApp
  /** The privacy section, which lists the commit and the other apps. */
  href: string
}

export function PrivacyReferenceAppStat({ app, href }: Props) {
  const notes = getReferenceAppNotes(app)

  return (
    <ProjectSummaryStat
      title={REFERENCE_APP.title}
      tooltip={REFERENCE_APP.tooltip}
      valueClassName="flex flex-col gap-0.5 max-md:items-end"
      value={
        <>
          <a href={href} className="flex items-center gap-1.5 hover:underline">
            <img
              src={app.iconUrl}
              alt=""
              className="size-5 shrink-0 rounded-sm"
            />
            {getReferenceAppLabel(app)}
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
