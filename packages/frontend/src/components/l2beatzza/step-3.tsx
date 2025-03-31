import { useCallback, useEffect, useState } from 'react'
import { cn } from '~/utils/cn'
import { PizzaCheckTile } from '../pizza-check-tile'

type Props = {
  onSubmit: (payload: Step3Payload) => void
}

export type Step3Payload = {
  type: 'custom'
  veggies: boolean | undefined
  cheese: boolean | undefined
  spicy: boolean | undefined
}

export function Step3Custom({ onSubmit }: Props) {
  const [step, setStep] = useState<'veggies' | 'cheese' | 'spicy'>('veggies')
  const [selections, setSelections] = useState<Step3Payload>({
    type: 'custom',
    veggies: undefined,
    cheese: undefined,
    spicy: undefined,
  })

  useEffect(() => {
    if (
      selections.veggies !== undefined &&
      selections.cheese !== undefined &&
      selections.spicy !== undefined
    ) {
      onSubmit(selections)
    }
  }, [selections, onSubmit])

  const handleSelect = useCallback(
    (value: boolean) => {
      if (step === 'veggies') {
        setSelections((prev) => ({ ...prev, veggies: value }))
        setStep('cheese')
      }

      if (step === 'cheese') {
        setSelections((prev) => ({ ...prev, cheese: value }))
        setStep('spicy')
      }

      if (step === 'spicy') {
        setSelections((prev) => ({ ...prev, spicy: value }))
      }
    },
    [step],
  )

  return (
    <div className="flex flex-col">
      <div className="pb-5 text-base font-bold">
        <div className="text-xs text-[#9621BF] dark:text-pink-200">
          Please share your preferences and we’ll prepare the best pizza for
          you.
        </div>
        <span className="text-xl font-bold">
          {step === 'veggies' && 'Would you like some veggies on your pizza?'}
          {step === 'cheese' && 'Would you like to have some cheese?'}
          {step === 'spicy' && 'Finally, would you like it spicy?'}
        </span>
      </div>
      <div className="flex size-full items-center justify-center gap-2">
        {step === 'veggies' && (
          <div className="flex w-full gap-2">
            <PizzaCheckTile
              image={<ThumbsUpIcon />}
              title="Yes, please!"
              onCheck={() => handleSelect(true)}
              checked={false}
            />
            <PizzaCheckTile
              image={<ThumbsDownIcon />}
              title="No, thanks"
              onCheck={() => handleSelect(false)}
              checked={false}
            />
          </div>
        )}
        {step === 'cheese' && (
          <div className="flex w-full gap-2">
            <PizzaCheckTile
              image={<ThumbsUpIcon />}
              title="Yes, please!"
              onCheck={() => handleSelect(true)}
              checked={false}
            />
            <PizzaCheckTile
              image={<ThumbsDownIcon />}
              title="No, thanks"
              onCheck={() => handleSelect(false)}
              checked={false}
            />
          </div>
        )}
        {step === 'spicy' && (
          <div className="flex w-full gap-2">
            <PizzaCheckTile
              image={<ThumbsUpIcon />}
              title="Yes, please!"
              onCheck={() => handleSelect(true)}
              checked={false}
            />
            <PizzaCheckTile
              image={<ThumbsDownIcon />}
              title="No, thanks"
              onCheck={() => handleSelect(false)}
              checked={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function ThumbsUpIcon(props: { className?: string }) {
  return (
    <div
      className={cn(
        'flex size-16 items-center justify-center text-[48px]',
        props.className,
      )}
    >
      👍
    </div>
  )
}

function ThumbsDownIcon() {
  return (
    <div className={cn('flex size-16 items-center justify-center text-[48px]')}>
      👎
    </div>
  )
}
