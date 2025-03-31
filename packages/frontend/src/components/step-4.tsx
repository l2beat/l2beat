import { useEffect, useState } from 'react'
import { api } from '~/trpc/react'
import { LazyLottie } from './lazy-lottie'
import animationData from './pizza-cook-frames.json'
import type { Step2Payload } from './step-2'
import type { Step3Payload } from './step-3'
import { Step5 } from './step-5'

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
    <div className="flex w-full items-center justify-center pb-[225px]">
      <div className="size-[350px] md:size-[500px]">
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
