import type { inferRouterOutputs } from '@trpc/server'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { AppRouter } from '~/server/api/root'
import { api } from '~/trpc/react'
import { LazyLottie } from './lazy-lottie'
import animationData from './pizza-cook-frames.json'
import { BigPizzaRosette } from './rosette/pizza/big-pizza-rosette'
import type { RosetteValue } from './rosette/types'
import { PizzaButton } from './step-1'
import type { Step2Payload } from './step-2'
import type { Step3Payload } from './step-3'

type Props = {
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
  const { data, isLoading, isError } = api.pizza.projects.useQuery(filters)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isError) {
    return <div>Error loading pizza data</div>
  }

  if (animationComplete && !isLoading && data) {
    return <Step5 data={data} />
  }

  return (
    <div className="items-center justify-center pb-[225px]">
      <div className="size-[500px]">
        <LazyLottie
          loop
          autoplay
          getJson={async () => animationData}
          id="pizza-cook"
        />
      </div>
    </div>
  )
}

export function Step5({ data }: { data: Response }) {
  const risks = data.scalingRisks.stacked ?? data.scalingRisks.self

  const values: RosetteValue[] = [
    {
      name: 'Exit Window',
      value: risks.exitWindow.value,
      sentiment: risks.exitWindow.sentiment,
    },
    {
      name: 'State Validation',
      value: risks.stateValidation.value,
      sentiment: risks.stateValidation.sentiment,
    },
    {
      name: 'Proposer Failure',
      value: risks.proposerFailure.value,
      sentiment: risks.proposerFailure.sentiment,
    },
    {
      name: 'Sequencer Failure',
      value: risks.sequencerFailure.value,
      sentiment: risks.sequencerFailure.sentiment,
    },
    {
      name: 'Data Availability',
      value: risks.dataAvailability.value,
      sentiment: risks.dataAvailability.sentiment,
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-2 items-center justify-center gap-7">
        <div className="z-100 flex flex-col">
          <div className="text-2xs font-bold uppercase text-purple-100 dark:text-pink-200">
            The best choice for you:
          </div>
          <div className="text-2xl font-bold">The {data.name} pizza!</div>
          <div className="text-[15px] text-gray-500">
            Would you like to order or pick a different one?
          </div>
          <div className="mt-4 flex gap-2">
            <Link href={`/scaling/projects/${data.slug}`}>
              <PizzaButton className="bg-[#9621BF] px-6 py-2 text-white dark:bg-pink-200">
                Learn more
              </PizzaButton>
            </Link>
            <PizzaButton variant={'outline'}>Pick different pizza</PizzaButton>
          </div>
        </div>
        <div className="min-w-full">
          <div className="relative z-10">
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
