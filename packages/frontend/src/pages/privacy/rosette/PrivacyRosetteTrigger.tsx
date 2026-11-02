import type { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipHtmlCopyOnly,
  TooltipTrigger,
  TooltipVisualOnly,
} from '~/components/core/tooltip/Tooltip'
import { PizzaRosetteTooltip } from '~/components/rosette/pizza/PizzaRosetteTooltip'
import type { RosetteValue } from '~/components/rosette/types'
import { TableLink } from '~/components/table/TableLink'
import { getPrivacyAdversariesSectionHref } from '../adversaries/privacyAdversaryUi'
import {
  PRIVACY_ASSESSMENT_TITLE,
  PrivacyRosetteAnalysis,
} from './PrivacyRosetteAnalysis'

const PLACEMENTS = {
  /** A summary table row, linking to the project page. */
  table: {
    Link: TableLink,
    linkClassName: undefined,
    // The trigger is the rosette alone.
    label: PRIVACY_ASSESSMENT_TITLE,
    // The reasons appear nowhere else on the summary page.
    contentInHtml: true,
    hint: 'Click for the reasons behind each verdict.',
  },
  /** The project page summary, linking down to its own section. */
  project: {
    Link: 'a',
    linkClassName: 'flex w-fit',
    label: undefined,
    contentInHtml: false,
    hint: undefined,
  },
} as const

interface Props {
  values: RosetteValue[]
  isUnderReview: boolean
  /** The project page. */
  href: string
  placement: keyof typeof PLACEMENTS
  children: ReactNode
}

/**
 * A link to the privacy assessment, with the L2 risk rosette's tooltip on
 * hover. A tap only follows the link, as in the L2 tables.
 */
export function PrivacyRosetteTrigger({
  values,
  isUnderReview,
  href,
  placement,
  children,
}: Props) {
  const settings = PLACEMENTS[placement]
  const Link = settings.Link

  return (
    <Tooltip contentInHtml={settings.contentInHtml}>
      <TooltipTrigger asChild disabledOnTouch>
        <Link
          href={getPrivacyAdversariesSectionHref(href)}
          aria-label={settings.label}
          className={settings.linkClassName}
        >
          {children}
        </Link>
      </TooltipTrigger>
      {/* Clear of the viewport edge, like the page's own gutter. */}
      <TooltipContent fitContent collisionPadding={16}>
        {/* The popup is a glance; the HTML copy keeps the reasons. */}
        <TooltipVisualOnly>
          <PizzaRosetteTooltip
            title={PRIVACY_ASSESSMENT_TITLE}
            values={values}
            isUnderReview={isUnderReview}
          />
          {settings.hint && (
            <p className="mt-3 font-normal text-paragraph-12 text-secondary leading-none">
              {settings.hint}
            </p>
          )}
        </TooltipVisualOnly>
        <TooltipHtmlCopyOnly>
          <PrivacyRosetteAnalysis
            values={values}
            isUnderReview={isUnderReview}
          />
        </TooltipHtmlCopyOnly>
      </TooltipContent>
    </Tooltip>
  )
}
