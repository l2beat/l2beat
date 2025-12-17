import * as RadixAlertDialog from '@radix-ui/react-alert-dialog'
import { cn } from '../utils/cn'

export const Modal = {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Title: ModalTitle,
  Description: ModalDescription,
  Body: ModalBody,
  Cancel: ModalCancel,
  Action: ModalAction,
}

function ModalRoot({ children, ...props }: RadixAlertDialog.AlertDialogProps) {
  return <RadixAlertDialog.Root {...props}>{children}</RadixAlertDialog.Root>
}

function ModalTrigger({
  children,
  ...props
}: RadixAlertDialog.AlertDialogTriggerProps) {
  return (
    <RadixAlertDialog.Trigger {...props}>{children}</RadixAlertDialog.Trigger>
  )
}

function ModalTitle({
  children,
  ...props
}: RadixAlertDialog.AlertDialogTitleProps) {
  return (
    <RadixAlertDialog.Title
      {...props}
      className={cn('mb-1 font-medium text-lg', props.className)}
    >
      {children}
    </RadixAlertDialog.Title>
  )
}

function ModalDescription({
  children,
  ...props
}: RadixAlertDialog.AlertDialogDescriptionProps) {
  return (
    <RadixAlertDialog.Description
      {...props}
      className={cn('mb-5 text-sm leading-normal', props.className)}
    >
      {children}
    </RadixAlertDialog.Description>
  )
}

export function ModalOverlay({
  children,
  ...props
}: RadixAlertDialog.AlertDialogOverlayProps) {
  return (
    <RadixAlertDialog.Portal>
      <RadixAlertDialog.Overlay
        className="fixed inset-0 z-20 data-[state=open]:bg-coffee-900/60"
        {...props}
      />
      {children}
    </RadixAlertDialog.Portal>
  )
}

function ModalBody({
  children,
  className,
  ...props
}: RadixAlertDialog.AlertDialogContentProps) {
  return (
    <ModalOverlay>
      <RadixAlertDialog.Content
        className={cn(
          '-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-[25] max-h-[85vh] w-[90vw] max-w-[500px] overflow-y-auto border border-coffee-400 bg-coffee-600 p-6 shadow-[var(--shadow-6)] focus:outline-none',
          className,
        )}
        {...props}
        aria-describedby={undefined}
      >
        {children}
      </RadixAlertDialog.Content>
    </ModalOverlay>
  )
}

function ModalCancel({
  children,
  ...props
}: RadixAlertDialog.AlertDialogCancelProps) {
  return (
    <RadixAlertDialog.Cancel {...props}>{children}</RadixAlertDialog.Cancel>
  )
}

function ModalAction({
  children,
  ...props
}: RadixAlertDialog.AlertDialogActionProps) {
  return (
    <RadixAlertDialog.Action {...props}>{children}</RadixAlertDialog.Action>
  )
}
