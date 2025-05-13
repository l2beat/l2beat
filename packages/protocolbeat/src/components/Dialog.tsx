import * as RadixDialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import type { SVGProps } from 'react'

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Title: DialogTitle,
  Body: DialogBody,
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

        <RadixDialog.Close asChild>
          <button
            className="absolute top-2.5 right-2.5 inline-flex cursor-pointer appearance-none items-center justify-center rounded-full focus:outline-none"
            aria-label="Close"
          >
            <XIcon className="stroke-coffee-200" />
          </button>
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
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
