import { cn } from '~/utils/cn'
import { Button, type ButtonProps } from '../core/Button'

export function PizzaButton(
  props: ButtonProps & { children: React.ReactNode },
) {
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
