import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import {
  CROP_CRITERIA,
  type CropCriteria,
  REFERENCE_SLOT,
} from '../cropCriteria'
import { CROP_COLUMNS } from '../crops'
import { CropBadge } from './CropBadge'
import { SectionHeading } from './SectionHeading'

export function CropsSection() {
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        title="The four crops"
        description="Each crop is judged on its own and here is the criteria."
      />
      <div className="flex flex-col gap-4 md:gap-6">
        {CROP_CRITERIA.map((criteria, index) => (
          <CropCard key={criteria.key} criteria={criteria} index={index} />
        ))}
      </div>
    </section>
  )
}

function CropCard({
  criteria,
  index,
}: {
  criteria: CropCriteria
  index: number
}) {
  const column = CROP_COLUMNS.find((it) => it.key === criteria.key)
  if (!column) {
    return null
  }

  return (
    <PrimaryCard className="md:p-8">
      <div className="flex items-start gap-4 md:gap-5">
        <CropBadge
          letter={column.letter}
          label={column.label}
          note={column.note}
          evaluation={{ sentiment: 'good', points: [criteria.summary] }}
          delay={index * 0.12}
        />
        <div>
          <h3 className="font-bold text-heading-20 md:text-heading-24">
            {column.label}
          </h3>
          <p className="mt-1 font-medium text-[#4f7a3e] text-paragraph-14 md:text-paragraph-16 dark:text-[#8fbc76]">
            {criteria.question}
          </p>
        </div>
      </div>
      {column.note && (
        <p className="mt-4 text-paragraph-14 text-secondary md:text-paragraph-15">
          {column.note}
        </p>
      )}
      <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-8">
        <div>
          <h4 className="font-semibold text-subtitle-12 uppercase tracking-wider">
            The minimum
          </h4>
          <ul className="mt-3 flex flex-col gap-2.5">
            {criteria.minimums.map((minimum) => (
              <li
                key={minimum}
                className="flex items-start gap-2.5 text-paragraph-14 md:text-paragraph-15"
              >
                <CheckMark />
                <span>
                  <Minimum text={minimum} reference={criteria.reference} />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-subtitle-12 uppercase tracking-wider">
            What pulls it down
          </h4>
          <ul className="mt-3 flex flex-col gap-2.5">
            {criteria.pullsDown.map((pullDown) => (
              <li
                key={pullDown}
                className="flex items-start gap-2.5 text-paragraph-14 md:text-paragraph-15"
              >
                <span
                  aria-hidden
                  className="mt-[9px] h-[2px] w-2.5 shrink-0 rounded-full bg-[#e0a52a] dark:bg-[#ffc107]"
                />
                {pullDown}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PrimaryCard>
  )
}

/**
 * A minimum, with the outside authority linked in place of `REFERENCE_SLOT`.
 * Without a slot the sentence renders as written, so only the criteria that
 * defer to someone carry a link.
 */
function Minimum({
  text,
  reference,
}: {
  text: string
  reference: CropCriteria['reference']
}) {
  const [before, after] = text.split(REFERENCE_SLOT)
  if (after === undefined || !reference) {
    return before
  }
  return (
    <>
      {before}
      <a
        href={reference.href}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-baseline gap-1 font-medium text-link"
      >
        {reference.label}
        <CustomLinkIcon className="fill-current" />
      </a>
      {after}
    </>
  )
}

function CheckMark() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      className="mt-0.5 shrink-0 text-[#1a9d4f] dark:text-[#15ca60]"
      aria-hidden
    >
      <path
        d="M3.5 8.6 6.4 11.5 12.5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
