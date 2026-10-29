import * as RadixDialog from '@radix-ui/react-dialog'
import { useEffect } from 'react'
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
      className={cn(
        'mb-1 font-semibold text-base text-coffee-100',
        props.className,
      )}
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
      className={cn('mb-4 text-coffee-300 text-xs leading-4', props.className)}
    >
      {children}
    </RadixDialog.Description>
  )
}

function DialogOverlay({ children, ...props }: RadixDialog.DialogOverlayProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay
        className="fixed inset-0 z-20 data-[state=open]:bg-black/50"
        {...props}
      />
      {children}
    </RadixDialog.Portal>
  )
}

// A modal Radix dialog sets `pointer-events: none` on <body>, which restyles
// every element of a large page on open and on close. Dialogs opened often
// pass `modal={false}` to the root and `nonModal` here. They get a plain
// overlay that blocks the page and closes the dialog when clicked, and keep
// the rest of modal behavior: Tab stays inside, the page is aria-hidden.
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
          '-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-25 max-h-[85vh] w-[90vw] max-w-[500px] overflow-y-auto rounded-md border border-coffee-600 bg-coffee-900 p-5 text-coffee-100 shadow-[0_16px_40px_-12px_#000000ee] focus:outline-hidden',
          className,
        )}
        {...props}
        onKeyDown={(event) => {
          props.onKeyDown?.(event)
          if (nonModal) {
            keepTabInside(event)
          }
        }}
        aria-describedby={undefined}
      >
        {children}

        {!noCloseButton && (
          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 inline-flex size-7 cursor-pointer appearance-none items-center justify-center rounded-sm text-coffee-300 hover:bg-coffee-700 hover:text-coffee-100 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-autumn-300"
              aria-label="Close"
            >
              <IconClose />
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
      <PageBlocker />
      {props.children}
    </RadixDialog.Portal>
  )
}

// Inside the portal, so it exists only while the dialog is open.
function PageBlocker({ ref }: { ref?: React.Ref<HTMLDivElement> }) {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root === null) {
      throw new Error('Missing #root')
    }
    root.setAttribute('aria-hidden', 'true')
    return () => root.removeAttribute('aria-hidden')
  }, [])

  return <div ref={ref} className="fixed inset-0 z-20 bg-black/50" />
}

const TABBABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

function keepTabInside(event: React.KeyboardEvent<HTMLElement>) {
  if (event.key !== 'Tab') {
    return
  }
  const tabbable = [
    ...event.currentTarget.querySelectorAll<HTMLElement>(TABBABLE),
  ]
  const first = tabbable[0]
  const last = tabbable[tabbable.length - 1]
  if (first === undefined || last === undefined) {
    event.preventDefault()
    return
  }
  const index = tabbable.indexOf(document.activeElement as HTMLElement)
  if (event.shiftKey && index <= 0) {
    event.preventDefault()
    last.focus()
  } else if (
    !event.shiftKey &&
    (index === -1 || index === tabbable.length - 1)
  ) {
    event.preventDefault()
    first.focus()
  }
}

function DialogClose({ children, ...props }: RadixDialog.DialogCloseProps) {
  return <RadixDialog.Close {...props}>{children}</RadixDialog.Close>
}
