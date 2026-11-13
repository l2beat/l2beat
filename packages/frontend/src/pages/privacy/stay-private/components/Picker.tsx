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
  action,
  className,
  children,
}: {
  number: number
  question: string
  note?: string
  /** A small control beside the question, e.g. a reset. */
  action?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="flex w-full items-center gap-2 font-bold text-heading-16">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-2xs text-primary-invert">
          {number}
        </span>
        {question}
        {action && <span className="ml-auto font-normal">{action}</span>}
      </legend>
      {note && <p className="mt-1 text-paragraph-12 text-secondary">{note}</p>}
      <div className={cn('mt-2 grid gap-1', className)}>{children}</div>
    </fieldset>
  )
}

/**
 * One option: a radio where one answer is taken, a checkbox where several
 * are. The native input stays visible, so the control reads as what it is.
 */
export function PickerOption({
  type = 'radio',
  name,
  value,
  checked,
  onChange,
  label,
  description,
  trailing,
  disabled = false,
}: {
  type?: 'radio' | 'checkbox'
  name: string
  value: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: ReactNode
  /** Right-aligned, e.g. how many protocols an answer leads to. */
  trailing?: ReactNode
  disabled?: boolean
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-2.5 rounded-lg border border-transparent px-2.5 py-2 transition-colors hover:bg-surface-secondary',
        'has-checked:bg-brand/8 has-focus-visible:outline-2 has-focus-visible:outline-brand',
        disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-px size-4 shrink-0 accent-brand"
      />
      <span className="flex min-w-0 grow flex-col gap-0.5">
        <span className="font-bold text-label-value-14 leading-4">{label}</span>
        {description && (
          <span className="text-paragraph-12 text-secondary">
            {description}
          </span>
        )}
      </span>
      {trailing}
    </label>
  )
}
