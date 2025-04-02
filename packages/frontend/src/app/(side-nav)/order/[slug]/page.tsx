import { notFound } from 'next/navigation'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { env } from '~/env'
import { ps } from '~/server/projects'
import type { RosetteValue } from '~/components/rosette/types'
import Link from 'next/link'
import Image from 'next/image'
import { BigPizzaRosette } from '~/components/rosette/pizza/big-pizza-rosette'
import type { ButtonProps } from '~/components/core/button'
import { Button, buttonVariants } from '~/components/core/button'
import { cn } from '~/utils/cn'
type Params = {
  slug: string
}

type Props = {
  params: Promise<Params>
}
export async function generateStaticParams(): Promise<Params[]> {
  if (env.VERCEL_ENV !== 'production') return []
  const projects = await ps.getProjects({
    where: ['scalingRisks'],
  })
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function Page(props: Props) {
  const params = await props.params

  const project = await ps.getProject({
    slug: params.slug,
    select: ['scalingRisks'],
  })

  if (!project) {
    return notFound()
  }
  const risks = project.scalingRisks.stacked ?? project.scalingRisks.self

  const values: RosetteValue[] = [
    {
      name: 'Sequencer Failure',
      value: risks.sequencerFailure.value,
      sentiment: risks.sequencerFailure.sentiment,
      description: risks.sequencerFailure.description,
    },
    {
      name: 'State Validation',
      value: risks.stateValidation.value,
      sentiment: risks.stateValidation.sentiment,
      description: risks.stateValidation.description,
    },
    {
      name: 'Data Availability',
      value: risks.dataAvailability.value,
      sentiment: risks.dataAvailability.sentiment,
      description: risks.dataAvailability.description,
    },
    {
      name: 'Exit Window',
      value: risks.exitWindow.value,
      sentiment: risks.exitWindow.sentiment,
      description: risks.exitWindow.description,
    },
    {
      name: 'Proposer Failure',
      value: risks.proposerFailure.value,
      sentiment: risks.proposerFailure.sentiment,
      description: risks.proposerFailure.description,
    },
  ]

  return (
    <PrimaryCard className="min-h-[350px] pb-16 pt-8 md:mt-[83px]">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-12">
          <div className="flex w-full flex-col md:w-1/2">
            <div className="text-2xs font-bold uppercase text-purple-100 dark:text-pink-200">
              Someone just ordered the
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Image
                  src={`/icons/${project.slug}.png`}
                  alt={project.name}
                  width={20}
                  height={20}
                />
                <div className="mt-0.5 text-2xl font-bold !leading-none">
                  {project.shortName ?? project.name} pizza!
                </div>
              </div>
            </div>
            <div className="mb-4 text-[15px] leading-tight text-secondary">
              Would you like to order your own pizza?
            </div>

            <div className="mt-2 flex gap-2">
              <Link
                href={`/scaling/projects/${project.slug}#risk-analysis`}
                className={cn(
                  buttonVariants(),
                  'rounded-lg bg-pink-900 px-6 py-2 text-white hover:bg-pink-900/90 dark:bg-pink-200 dark:text-black dark:hover:bg-pink-200/90',
                )}
              >
                Learn more
              </Link>
              <PizzaButton
                className="group grid cursor-not-allowed place-items-center bg-transparent hover:bg-transparent"
                variant="outline"
              >
                <span className="col-start-1 row-start-1 group-hover:opacity-0">
                  Get your own pizza
                </span>
                <span className="col-start-1 row-start-1 opacity-0 group-hover:opacity-100">
                  We&apos;re out of dough ☹️
                </span>
              </PizzaButton>
            </div>
          </div>
          <div className="size-[350px] w-full md:w-1/2">
            <div className="relative size-[350px] md:h-full">
              <PizzaBackground className="absolute left-1/2 top-1/2 size-[350px] -translate-x-1/2 -translate-y-1/2" />
              <BigPizzaRosette
                values={values}
                realPizza
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </div>
      </div>
    </PrimaryCard>
  )
}

function PizzaButton(props: ButtonProps & { children: React.ReactNode }) {
  return (
    <Button
      onClick={props.onClick}
      className={cn(
        props.className,
        'rounded-lg bg-pink-900 px-6 py-2 text-white hover:bg-pink-900/90 dark:bg-pink-200 dark:text-black dark:hover:bg-pink-200/90',
      )}
      {...props}
    >
      {props.children}
    </Button>
  )
}

function PizzaBackground({ className }: { className?: string }) {
  return (
    <svg
      width="324"
      height="302"
      viewBox="0 0 324 302"
      fill="none"
      className={className}
    >
      <path
        d="M324 163.006C323.953 142.295 320.496 121.944 314.857 103.092C298.016 46.7912 259.121 -2.38895 208.537 0.0898307C176.102 1.67885 143.679 7.11409 111.243 11.4214C83.5571 15.0978 56.0317 18.4657 32.8214 43.2176C22.7763 53.9301 14.3717 67.3766 8.76879 82.4419C-6.80943 124.327 -0.362868 173.773 18.1304 209.878C36.6243 245.983 65.5382 270.622 95.648 290.023C107.925 297.935 121.801 305.265 135.763 300.331C144.361 297.291 151.874 289.919 160.144 285.33C187.968 269.888 217.911 288.054 247.355 284.14C264.846 281.815 282.144 271.302 295.293 255.007C310.998 235.543 320.399 208.528 323.107 181.521C323.727 175.337 324.013 169.155 324 163.006Z"
        fill="#FF5FFB"
        fillOpacity="0.4"
      />
    </svg>
  )
}
