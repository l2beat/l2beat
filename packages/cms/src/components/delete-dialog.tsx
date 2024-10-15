'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from './ui/button'

export function DeleteDialog({
  open,
  onOpenChange,
  onAction,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAction: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            You are about to delete this item. This action is irreversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" type="button" onClick={onAction}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
