import clsx from 'clsx'
import { useState } from 'react'
import { Button } from './core/button'
import { PizzaCheckTile } from './pizza-check-tile'

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
      <div className="text-base font-bold">
        The pizza of the day is prepared with sourdough. We have two options
        ready for you, or you can choose a custom one.
      </div>
      <div className="flex w-full gap-2">
        <PizzaCheckTile
          title="Vegetarian Pizza"
          // image={<Image src="/images/tomato.png" alt="Tomato" />}
          onCheck={() => setSelected({ type: 'predefined', pizza: 'veggie' })}
          checked={
            selected?.type === 'predefined' && selected.pizza === 'veggie'
          }
          subTitle="Pesto base, Spinach, zucchini slices, broccoli - all green"
        />
        <PizzaCheckTile
          title="Tomato-based Pizza"
          subTitle="Tomato sauce, tomatoes, garlic, oregano - all red"
          // image={<Image src="/images/tomato.png" alt="Tomato" />}
          onCheck={() => setSelected({ type: 'predefined', pizza: 'tomato' })}
          checked={
            selected?.type === 'predefined' && selected.pizza === 'tomato'
          }
        />
        <PizzaCheckTile
          title="Custom - I want to be creative"
          // image={<Image src="/images/tomato.png" alt="Tomato" />}
          onCheck={() => setSelected({ type: 'custom' })}
          checked={selected?.type === 'custom'}
        />
      </div>
      <Button
        disabled={!selected}
        onClick={() => selected && props.onClick(selected)}
        className={clsx(
          'bg-pink-900 px-8 py-4 text-white',
          !selected && 'opacity-50',
        )}
      >
        Let&apos;s get that pizza party rolling.
      </Button>
    </div>
  )
}
