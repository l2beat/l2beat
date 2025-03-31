import { cn } from '~/utils/cn'
import { Button, type ButtonProps } from './core/button'

export function PizzaButton(
  props: ButtonProps & { children: React.ReactNode },
) {
  return (
    <Button
      onClick={props.onClick}
      className={cn(
        'rounded-[4px] bg-pink-900 px-6 py-4 text-xs text-white hover:bg-pink-900/90 dark:bg-pink-200 dark:text-black dark:hover:bg-pink-200/90',
        props.className,
      )}
      {...props}
    >
      {props.children}
    </Button>
  )
}
