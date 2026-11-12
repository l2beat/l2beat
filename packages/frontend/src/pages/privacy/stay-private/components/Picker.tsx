import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

/**
 * A numbered question answered by its options. Native inputs, so arrow keys
 * move between radios and screen readers announce the group.
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

/** One option: a radio where one answer is taken, a checkbox where several are. */
export function PickerOption({
  type = 'radio',
  name,
  value,
  checked,
  onChange,
  className,
  children,
}: {
  type?: 'radio' | 'checkbox'
  name: string
  value: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  children: ReactNode
}) {
  return (
    <label
      className={cn(
        'relative cursor-pointer rounded-lg border border-divider px-3 py-2.5 transition-colors hover:bg-surface-secondary',
        'has-checked:border-brand has-checked:bg-brand/10 has-focus-visible:outline-2 has-focus-visible:outline-brand',
        type === 'checkbox' && 'pl-9',
        className,
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={
          type === 'checkbox'
            ? 'absolute top-3 left-3 size-4 accent-brand'
            : 'sr-only'
        }
      />
      {children}
    </label>
  )
}
