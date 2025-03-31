import type { inferRouterOutputs } from '@trpc/server'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { SvgIconProps } from '~/icons/svg-icon'
import type { AppRouter } from '~/server/api/root'
import { api } from '~/trpc/react'
import { LazyLottie } from '../lazy-lottie'
import animationData from '../pizza-cook-frames.json'
import { BigPizzaRosette } from '../rosette/pizza/big-pizza-rosette'
import type { RosetteValue } from '../rosette/types'
import { PizzaButton } from './step-1'
import type { Step2Payload } from './step-2'
import type { Step3Payload } from './step-3'

type Props = {
  onReset: () => void
  state: {
    step1: boolean
    step2: Step2Payload
    step3: Step3Payload
  }
}

function getFilters(state: Props['state']) {
  if (state.step2.type === 'predefined') {
    switch (state.step2.pizza) {
      case 'tomato':
        return { green: false, yellow: false, red: true }
      case 'veggie':
        return { green: true, yellow: false, red: false }
    }
  }

  // For custom selections
  return {
    green: state.step3.veggies === true,
    yellow: state.step3.cheese === true,
    red: state.step3.spicy === true,
  }
}

type RouterOutput = inferRouterOutputs<AppRouter>
type Response = RouterOutput['pizza']['projects']

export function Step4(props: Props) {
  const [animationComplete, setAnimationComplete] = useState(false)
  const filters = getFilters(props.state)
  const { data, isLoading, isError } = api.pizza.projects.useQuery(filters, {
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isError) {
    return <div>Error loading pizza data</div>
  }

  if (animationComplete && !isLoading && data !== undefined) {
    return <Step5 data={data} onReset={props.onReset} />
  }

  return (
    <div className="mx-auto flex size-full items-center justify-center pb-[225px] md:size-[500px]">
      <LazyLottie
        loop
        autoplay
        getJson={async () => animationData}
        id="pizza-cook"
      />
    </div>
  )
}

export function Step5({
  data,
  onReset,
}: {
  data: Response
  onReset: () => void
}) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-2 items-center justify-center gap-7">
          <div className="z-100 flex flex-col">
            <div className="text-2xl font-bold">Mamma mia!</div>
            <div className="text-[15px] leading-tight text-gray-500">
              We could not find a pizza that matches your preferences. Maybe you
              should try a different one?
            </div>
            <div className="mt-4 flex gap-2">
              <PizzaButton variant={'outline'} onClick={onReset}>
                Pick different pizza
              </PizzaButton>
            </div>
          </div>
          <div className="min-w-full">
            <div className="relative z-10">
              <PizzaBackground className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 xs:size-[350px]" />
              <Frown className="absolute left-1/2 top-1/2 size-[160px] -translate-x-1/2 -translate-y-1/2 fill-none stroke-pink-200" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const risks = data.scalingRisks.stacked ?? data.scalingRisks.self

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
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-7 md:flex-row">
        <div className="flex w-full flex-col md:w-1/2">
          <div className="text-2xs font-bold uppercase text-purple-100 dark:text-pink-200">
            The best choice for you:
          </div>
          <div>
            <div className="flex items-center gap-2 ">
              <Image
                src={`/icons/${data.slug}.png`}
                alt={data.name}
                width={20}
                height={20}
              />
              <div className="text-2xl font-bold">{data.name} pizza!</div>
            </div>
          </div>
          <div className="text-[15px] text-gray-500">
            Would you like to order or pick a different one?
          </div>
          <div className="mt-4 flex gap-2">
            <Link href={`/scaling/projects/${data.slug}`}>
              <PizzaButton>Learn more</PizzaButton>
            </Link>
            <PizzaButton
              variant="outline"
              className="rounded-[4px] bg-transparent text-xs"
              onClick={onReset}
            >
              Pick different pizza
            </PizzaButton>
          </div>
        </div>
        <div className="-ml-6 w-full md:w-1/2">
          <div className="relative size-[350px] md:h-full">
            <PizzaBackground className="absolute left-1/2 top-1/2 size-[350px] -translate-x-1/2 -translate-y-1/2" />
            <BigPizzaRosette
              values={values}
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>
    </div>
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

function Frown(props: SvgIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  )
}
