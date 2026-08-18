import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { SectionHeading } from '../../components/SectionHeading'
import { GROUND_RULES, PROCESS_STEPS } from '../content'

export function ProcessSection() {
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading title="How a review works" />
      <PrimaryCard className="overflow-hidden p-0 md:p-0">
        <div className="border-divider border-b bg-surface-secondary/40 p-5 md:p-6">
          <h3 className="font-bold text-heading-16">
            Before a review can start
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {GROUND_RULES.map((rule) => (
              <li
                key={rule}
                className="flex items-start gap-2.5 text-paragraph-14 text-secondary md:text-paragraph-15"
              >
                <span
                  aria-hidden
                  className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#7fae6a] dark:bg-[#8fbc76]"
                />
                {rule}
              </li>
            ))}
          </ul>
        </div>
        <ol className="relative p-5 md:p-8">
          {PROCESS_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative pb-7 pl-11 last:pb-0 md:pl-14"
            >
              {index < PROCESS_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-9 left-[15px] h-[calc(100%-28px)] border-[#cfe3c0] border-l-2 border-dashed md:left-[17px] dark:border-[#2c3a22]"
                />
              )}
              <span className="absolute top-0 left-0 flex size-8 items-center justify-center rounded-full bg-[#eef7e8] font-bold text-[#4f7a3e] text-label-value-14 md:size-9 dark:bg-[#1f2a19] dark:text-[#8fbc76]">
                {index + 1}
              </span>
              <h3 className="pt-1 font-bold text-heading-16 md:text-heading-18">
                {step.title}
              </h3>
              <p className="mt-1.5 max-w-3xl text-paragraph-14 text-secondary md:text-paragraph-15">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </PrimaryCard>
    </section>
  )
}
