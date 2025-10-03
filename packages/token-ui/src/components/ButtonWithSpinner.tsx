import { cn } from '~/utils/cn'
import { Button } from './core/Button'
import { Spinner } from './core/Spinner'

export function ButtonWithSpinner({
  isLoading,
  children,
  className,
  disabled,
  ...props
}: { isLoading: boolean; spinnerClassName?: string } & React.ComponentProps<
  typeof Button
>) {
  return (
    <Button
      className={cn(className, 'relative')}
      disabled={isLoading || disabled}
      {...props}
    >
      <span className={cn(isLoading && 'opacity-0')}>{children}</span>
      <Spinner
        className={cn(
          '-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 size-5 fill-white opacity-0',
          isLoading && 'opacity-100',
        )}
      />
    </Button>
  )
}
