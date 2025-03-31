import { cn } from '~/utils/cn'
import { Button, type ButtonProps } from '../core/button'
import Image from 'next/image'

type Props = {
  onClick: () => void
}

export function PizzaButton(
  props: ButtonProps & { children: React.ReactNode },
) {
  return (
    <Button
      onClick={props.onClick}
      className={cn(
        props.className,
        'rounded-[4px] bg-pink-900 px-6 py-4 text-xs text-white hover:bg-pink-900/90 dark:bg-pink-200 dark:text-black dark:hover:bg-pink-200/90',
      )}
      {...props}
    >
      {props.children}
    </Button>
  )
}

export function Step1(props: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-7">
      <Image
        src="/images/l2beatzza/open-pizza.png"
        alt="Open pizza"
        width={1000}
        height={1000}
        className="w-full max-w-[360px]"
      />
      <PizzaButton onClick={props.onClick}>Start making my pizza</PizzaButton>
    </div>
  )
}
