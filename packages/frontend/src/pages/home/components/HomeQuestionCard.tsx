import { externalLinks } from '~/consts/externalLinks'
import { CustomLinkIcon } from '~/icons/Outlink'
import { cn } from '~/utils/cn'
import { HOME_BUTTON_CLASS, HOME_TEXT } from '../homeStyles'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'

/** The page's close: the question and its answer on one row from md. */
export function HomeQuestionCard({ className }: { className?: string }) {
  return (
    // In ink, closing the page as the pink mandate opens it.
    <HomeCard
      className={cn(
        'home-inverted flex flex-col gap-4 text-primary md:flex-row md:items-center md:justify-between md:gap-8',
        className,
      )}
    >
      <div className="flex flex-col gap-1.5">
        <HomeCardHeader title="Have a question?" />
        <p className={HOME_TEXT.body}>
          Ask about our data, provide feedback on our frameworks, or request
          research into a new project.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
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
