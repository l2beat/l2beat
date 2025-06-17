import * as RadixDialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import type { ButtonHTMLAttributes, InputHTMLAttributes, SVGProps } from 'react'

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Button: DialogButton,
  Close: DialogClose,
  Input: DialogInput,
}

function DialogRoot({ children, ...props }: RadixDialog.DialogProps) {
  return <RadixDialog.Root {...props}>{children}</RadixDialog.Root>
}

function DialogTrigger({ children, ...props }: RadixDialog.DialogTriggerProps) {
  return <RadixDialog.Trigger {...props}>{children}</RadixDialog.Trigger>
}

function DialogTitle({ children, ...props }: RadixDialog.DialogTitleProps) {
  return (
    <RadixDialog.Title
      {...props}
      className={clsx('mb-1 font-medium text-lg', props.className)}
    >
      {children}
    </RadixDialog.Title>
  )
}

function DialogDescription({
  children,
  ...props
}: RadixDialog.DialogDescriptionProps) {
  return (
    <RadixDialog.Description
      {...props}
      className={clsx('mb-5 text-sm leading-normal', props.className)}
    >
      {children}
    </RadixDialog.Description>
  )
}

function DialogBody({ children, ...props }: RadixDialog.DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-20 data-[state=open]:bg-coffee-900/60" />
      <RadixDialog.Content
        className={clsx(
          '-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-[25] max-h-[85vh] w-[90vw] max-w-[500px] overflow-y-auto border border-coffee-400 bg-coffee-600 p-6 shadow-[var(--shadow-6)] focus:outline-none',
          props.className,
        )}
        {...props}
      >
        {children}

        <Dialog.Close asChild>
          <button
            className="absolute top-2.5 right-2.5 inline-flex cursor-pointer appearance-none items-center justify-center rounded-full focus:outline-none"
            aria-label="Close"
          >
            <XIcon className="stroke-coffee-200" />
          </button>
        </Dialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}

export function DialogButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        'border border-coffee-400 px-4 py-1 font-medium text-sm transition-colors duration-100 hover:bg-coffee-400 disabled:opacity-50 disabled:hover:bg-transparent',
        props.className,
      )}
    >
      {children}
    </button>
  )
}

function XIcon(props?: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path
        d="M18 6L6 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L18 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DialogClose({ children, ...props }: RadixDialog.DialogCloseProps) {
  return <RadixDialog.Close {...props}>{children}</RadixDialog.Close>
}

function DialogInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      onKeyUp={(e) => {
        e.stopPropagation()
        props.onKeyUp?.(e)
      }}
      onKeyDown={(e) => {
        e.stopPropagation()
        props.onKeyDown?.(e)
      }}
      className={clsx(
        'border border-coffee-400 bg-coffee-400/20 px-2 py-1 text-sm placeholder:text-coffee-200/40 focus:border-coffee-300 focus:outline-none',
        className,
      )}
      {...props}
    />
  )
}
