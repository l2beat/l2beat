import { CropBadge } from '~/components/garden/CropBadge'
import { CROP_COLUMNS, type CropDefinition } from '~/components/garden/crops'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import {
  CROP_CRITERIA,
  type CropCriteria,
  REFERENCE_SLOT,
} from '../cropCriteria'
import { SectionHeading } from './SectionHeading'

export function CropsSection() {
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        title="The four properties"
        description="What we look for in each property. This is guidance, not a checklist: the rating is our judgment and can weigh things that are not listed here."
        size="md"
      />
      <div className="flex flex-col gap-4 md:gap-6">
        {CROP_COLUMNS.map((column, index) => (
          <CropCard
            key={column.key}
            column={column}
            criteria={CROP_CRITERIA[column.key]}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

function CropCard({
  column,
  criteria,
  index,
}: {
  column: CropDefinition
  criteria: CropCriteria
  index: number
}) {
  return (
    <PrimaryCard className="max-md:mx-4 max-md:rounded-xl md:p-8">
      <div className="flex items-start gap-4 md:gap-5">
        {/* The badge centres the plant in its box; pulled back, the soil lines up with the text below. */}
        <div className="-ml-3">
          <CropBadge
            status="reviewed"
            sentiment="good"
            delay={index * 0.12}
            label={column.label}
          >
            <p className="font-medium text-base text-crop-good-ink">
              {column.label}
            </p>
            <p className="mt-1.5">{criteria.summary}</p>
          </CropBadge>
        </div>
        <div>
          <h3 className="font-bold text-heading-18 md:text-heading-20">
            {column.label}
          </h3>
          <p className="mt-1 text-pretty font-medium text-garden-accent text-paragraph-14 md:text-balance md:text-paragraph-16">
            {criteria.question}
          </p>
        </div>
      </div>
      {column.note && (
        <p className="mt-4 max-w-2xl text-pretty text-paragraph-14 text-secondary md:text-paragraph-15">
          {column.note}
        </p>
      )}
      <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-8">
        <div>
          <h4 className="font-semibold text-paragraph-14 text-secondary">
            What we look for
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
          <h4 className="font-semibold text-paragraph-14 text-secondary">
            What lowers the rating
          </h4>
          <ul className="mt-3 flex flex-col gap-2.5">
            {criteria.pullsDown.map((pullDown) => (
              <li
                key={pullDown}
                className="flex items-start gap-2.5 text-paragraph-14 md:text-paragraph-15"
              >
                <span
                  aria-hidden
                  className="mx-[3px] mt-[9px] h-[2px] w-2.5 shrink-0 rounded-full bg-crop-warning"
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

/** A minimum, with `reference` linked in place of `REFERENCE_SLOT`. */
function Minimum({
  text,
  reference,
}: {
  text: string
  reference: CropCriteria['reference']
}) {
  const [before = '', after] = text.split(REFERENCE_SLOT)
  if (after === undefined || !reference) {
    return <Emphasis text={before} />
  }
  const isExternal = reference.href.startsWith('http')
  return (
    <>
      <Emphasis text={before} />
      <a
        href={reference.href}
        {...(isExternal && { target: '_blank', rel: 'noreferrer noopener' })}
        className="font-medium text-link"
      >
        {reference.label}
        {isExternal && (
          <CustomLinkIcon className="ml-1 inline-block fill-current align-baseline" />
        )}
      </a>
      <Emphasis text={after} />
    </>
  )
}

/** Renders `**bold**` spans, e.g. a lead-in like "**Passes the walkaway test:**". */
function Emphasis({ text }: { text: string }) {
  return text.split(/\*\*(.+?)\*\*/).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

function CheckMark() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      className="mt-0.5 shrink-0 text-crop-good"
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
