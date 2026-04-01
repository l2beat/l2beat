import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/core/Dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import { Markdown } from '~/components/markdown/Markdown'

export function VerificationSteps({
  verificationSteps,
}: {
  verificationSteps?: string
}) {
  if (!verificationSteps) {
    return (
      <span className="mt-px font-medium text-label-value-13 text-secondary opacity-50">
        None
      </span>
    )
  }

  const trigger = (
    <div className="font-medium text-label-value-13 text-link underline">
      Verification steps
    </div>
  )

  return (
    <>
      <Dialog>
        <DialogTrigger className="max-md:hidden">{trigger}</DialogTrigger>
        <DialogContent className="md:max-w-[720px]">
          <DialogClose />
          <DialogHeader>
            <DialogTitle>Verification steps</DialogTitle>
          </DialogHeader>
          <Markdown className="text-paragraph-16">{verificationSteps}</Markdown>
        </DialogContent>
      </Dialog>
      <Drawer>
        <DrawerTrigger className="md:hidden">{trigger}</DrawerTrigger>
        <DrawerContent className="pb-6 dark:bg-surface-primary">
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle className="font-semibold text-label-value-18">
              Verification steps
            </DrawerTitle>
          </DrawerHeader>
          <Markdown className="text-paragraph-15">{verificationSteps}</Markdown>
        </DrawerContent>
      </Drawer>
    </>
  )
}
