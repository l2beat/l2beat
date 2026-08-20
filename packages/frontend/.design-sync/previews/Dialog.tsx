import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@l2beat/frontend'

export function Open() {
  return (
    <Dialog open modal={false}>
      <DialogContent className="max-w-lg">
        <DialogClose />
        <DialogHeader>
          <DialogTitle>Recategorisation notice</DialogTitle>
          <DialogDescription>
            Starting with the next update, projects that do not publish state
            diffs on Ethereum will be listed under Optimiums rather than
            Optimistic Rollups. This affects how their TVS is aggregated on the
            Scaling summary page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Read the changelog</Button>
          <Button variant="fill">Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
