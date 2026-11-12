import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

/**
 * A numbered question answered by one of its options. Native radios, so arrow
 * keys move between options and screen readers announce the group.
 */
export function PickerQuestion({
  number,
  question,
  note,
  className,
  children,
}: {
  number: number
  question: string
  note?: string
  className?: string
  children: ReactNode
}) {
  return (
    <fieldset>
      <legend className="flex items-center gap-2.5 font-bold text-heading-18 md:text-heading-20">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-tertiary text-label-12">
          {number}
        </span>
        {question}
      </legend>
      {note && (
        <p className="mt-1.5 text-paragraph-13 text-secondary">{note}</p>
      )}
      <div className={cn('mt-3 grid gap-2', className)}>{children}</div>
    </fieldset>
  )
}

export function PickerOption({
  name,
  value,
  checked,
  onChange,
  className,
  children,
}: {
  name: string
  value: string
  checked: boolean
  onChange: () => void
  className?: string
  children: ReactNode
}) {
  return (
    <label
      className={cn(
        'cursor-pointer rounded-lg border border-divider px-3 py-2.5 transition-colors hover:bg-surface-secondary',
        'has-checked:border-brand has-checked:bg-brand/10 has-focus-visible:outline-2 has-focus-visible:outline-brand',
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {children}
    </label>
  )
}
