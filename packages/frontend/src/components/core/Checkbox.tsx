import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import type * as React from 'react'
import { useId } from 'react'
import { useTracking } from '~/hooks/useTracking'
import { CheckIcon } from '~/icons/Check'
import { cn } from '~/utils/cn'

const Checkbox = ({
  ref,
  className,
  children,
  name,
  labelTitle,
  id: propsId,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  name: string
  labelTitle?: string
}) => {
  const id = useId()
  const usedId = propsId ?? id
  const { track } = useTracking()
  return (
    <label
      htmlFor={usedId}
      className={cn(
        'flex h-8 w-max cursor-pointer select-none items-center space-x-2 rounded-lg py-1 pr-3 pl-2',
        'bg-surface-primary primary-card:bg-surface-secondary',
        props.disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      title={labelTitle}
    >
      <CheckboxPrimitive.Root
        id={usedId}
        ref={ref}
        className={cn(
          'peer size-5 shrink-0 rounded bg-pure-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
          'data-[state=unchecked]:border-2 data-[state=unchecked]:border-surface-tertiary',
        )}
        {...props}
        onCheckedChange={(checked) => {
          props.onCheckedChange?.(checked)
          track('checkboxChanged', {
            props: {
              name,
              value: checked.valueOf().toString(),
            },
          })
        }}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center rounded bg-brand text-current">
          <CheckIcon
            className={cn(
              'size-5 stroke-[1.8px]',
              'primary-card:stroke-surface-secondary! stroke-surface-primary!',
            )}
          />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <div className="whitespace-pre font-medium text-xs leading-none md:text-sm">
        {children}
      </div>
    </label>
  )
}
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
