import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { PrivacyDeliveryIcons } from '~/components/projects/sections/privacy/PrivacyDeliveryIcons'
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
  const label = getReferenceAppLabel(app)
  const cut = label.lastIndexOf(' ') + 1
  const [head, lastWord] = [label.slice(0, cut), label.slice(cut)]

  return (
    <ProjectSummaryStat
      title={REFERENCE_APP.title}
      tooltip={REFERENCE_APP.tooltip}
      valueClassName="flex flex-col gap-0.5 max-md:items-end"
      value={
        <>
          <span className="flex items-center gap-1.5">
            <img
              src={app.iconUrl}
              alt=""
              className="size-5 shrink-0 rounded-sm"
            />
            {/* Only the words before the last may wrap, so the symbols stay with the name's last word. */}
            <span className="whitespace-nowrap">
              <a href={href} className="hover:underline">
                <span className="whitespace-normal">{head}</span>
                {lastWord}
              </a>{' '}
              <PrivacyDeliveryIcons
                app={app}
                className="inline-flex align-[-0.125em]"
              />
            </span>
          </span>
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
