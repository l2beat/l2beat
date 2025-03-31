import { useState } from 'react'
import { cn } from '~/utils/cn'
import { Button } from '../core/button'
import { PizzaCheckTile } from '../pizza-check-tile'
import Image from 'next/image'

type Props = {
  onClick: (payload: Step2Payload) => void
}

export type Step2Payload =
  | {
      type: 'predefined'
      pizza: 'tomato' | 'veggie'
    }
  | {
      type: 'custom'
    }

export function Step2(props: Props) {
  const [selected, setSelected] = useState<Step2Payload | null>(null)

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="mb-2 text-xl font-bold">
        The pizza of the day is prepared with sourdough. We have two options
        ready for you, or you can choose a custom one.
      </div>
      <div className="flex w-full gap-2">
        <PizzaCheckTile
          title="Vegetarian"
          image={
            <Image
              src="/images/l2beatzza/vegetarian.png"
              alt="Veggie"
              width={173}
              height={128}
              className="w-32"
            />
          }
          onCheck={() => setSelected({ type: 'predefined', pizza: 'veggie' })}
          checked={
            selected?.type === 'predefined' && selected.pizza === 'veggie'
          }
        />
        <PizzaCheckTile
          title="Spicy"
          image={
            <Image
              src="/images/l2beatzza/spicy.png"
              alt="Spicy"
              width={182}
              height={128}
              className="w-32"
            />
          }
          onCheck={() => setSelected({ type: 'predefined', pizza: 'tomato' })}
          checked={
            selected?.type === 'predefined' && selected.pizza === 'tomato'
          }
        />
        <PizzaCheckTile
          title="Custom"
          image={<div className="text-[80px]">🧑‍🍳</div>}
          onCheck={() => setSelected({ type: 'custom' })}
          checked={selected?.type === 'custom'}
        />
      </div>
      <Button
        disabled={!selected}
        onClick={() => selected && props.onClick(selected)}
        className={cn(
          'mt-5 rounded-[4px] bg-pink-900 px-6 py-4 text-xs text-white hover:bg-pink-900/90 dark:bg-pink-200 dark:text-black dark:hover:bg-pink-200/90',
          !selected && 'opacity-50',
        )}
      >
        Let&apos;s get that pizza party rolling.
      </Button>
    </div>
  )
}
