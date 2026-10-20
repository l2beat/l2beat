import * as RadixDialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { IconClose } from '../icons/IconClose'
import { cn } from '../utils/cn'

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Close: DialogClose,
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

export function DialogOverlay({
  children,
  ...props
}: RadixDialog.DialogOverlayProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay
        className="fixed inset-0 z-20 data-[state=open]:bg-coffee-900/60"
        {...props}
      />
      {children}
    </RadixDialog.Portal>
  )
}

// A modal Radix dialog sets `pointer-events: none` on <body>, which restyles
// every element of a large page on open and on close. Dialogs opened often
// pass `modal={false}` to the root and `nonModal` here, and get a plain
// overlay that blocks the page and closes the dialog when clicked.
function DialogBody({
  children,
  className,
  noCloseButton,
  nonModal,
  ...props
}: RadixDialog.DialogContentProps & {
  noCloseButton?: boolean
  nonModal?: boolean
}) {
  const Overlay = nonModal ? PlainOverlay : DialogOverlay
  return (
    <Overlay>
      <RadixDialog.Content
        className={cn(
          '-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-25 max-h-[85vh] w-[90vw] max-w-[500px] overflow-y-auto border border-coffee-400 bg-coffee-600 p-6 shadow-(--shadow-6) focus:outline-hidden',
          className,
        )}
        {...props}
        aria-describedby={undefined}
      >
        {children}

        {!noCloseButton && (
          <Dialog.Close asChild>
            <button
              className="absolute top-2.5 right-2.5 inline-flex cursor-pointer appearance-none items-center justify-center rounded-full focus:outline-hidden"
              aria-label="Close"
            >
              <IconClose className="stroke-coffee-200" />
            </button>
          </Dialog.Close>
        )}
      </RadixDialog.Content>
    </Overlay>
  )
}

function PlainOverlay(props: { children: React.ReactNode }) {
  return (
    <RadixDialog.Portal>
      <div className="fixed inset-0 z-20 bg-coffee-900/60" />
      {props.children}
    </RadixDialog.Portal>
  )
}

function DialogClose({ children, ...props }: RadixDialog.DialogCloseProps) {
  return <RadixDialog.Close {...props}>{children}</RadixDialog.Close>
}
