import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/src/common/projectCountdowns'
import { Countdown } from '~/components/countdown'
import { CustomLink } from '~/components/link/custom-link'
import { externalLinks } from '~/consts/external-links'
import { cn } from '~/utils/cn'
import { DynamicLogoList } from './dynamic-logo-list'

interface Props {
  projectsToBeMigrated: {
    slug: string
    name: string
  }[]
  className?: string
}

export function OtherMigrationTabNotice({
  projectsToBeMigrated,
  className,
}: Props) {
  if (projectsToBeMigrated.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'space-y-2.5 rounded-lg border-2 border-brand p-5',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold leading-none">Recategorisation</h2>
        <Countdown
          expiresAt={PROJECT_COUNTDOWNS.otherMigration.expiresAt.toNumber()}
          className="max-md:hidden"
          size="md"
        />
      </div>
      <p className="text-xs font-medium md:text-base">
        More projects will be classifed as &quot;Other&quot; due to its specific
        risks that set it apart from the standard classifications.
        <span className="max-md:hidden">
          {' '}
          Visit detail page of a specific project to view reasons.
        </span>
      </p>
      <Countdown
        expiresAt={PROJECT_COUNTDOWNS.otherMigration.expiresAt.toNumber()}
        className="md:hidden"
        size="sm"
      />
      <DynamicLogoList projects={projectsToBeMigrated} />
      <p className="text-xs font-bold md:text-base">
        Learn more about the recategorisation{' '}
        <CustomLink href={externalLinks.articles.recategorisation}>
          here
        </CustomLink>
        .
      </p>
    </div>
  )
}
