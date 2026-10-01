import { externalLinks } from '~/consts/externalLinks'
import { CustomLinkIcon } from '~/icons/Outlink'
import { cn } from '~/utils/cn'
import { HOME_BUTTON_CLASS, HOME_TEXT } from '../homeStyles'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'

export function HomeQuestionCard({ className }: { className?: string }) {
  return (
    <HomeCard className={cn('flex flex-col gap-3', className)}>
      <HomeCardHeader title="Have a question?" />
      <p className={HOME_TEXT.body}>
        Ask about our data, provide feedback on our frameworks, or request
        research into a new project.
      </p>
      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        <a
          href={externalLinks.forum}
          target="_blank"
          rel="noreferrer noopener"
          className={HOME_BUTTON_CLASS}
        >
          Start a discussion on the forum
          <CustomLinkIcon className="size-3 fill-current" />
        </a>
      </div>
    </HomeCard>
  )
}
