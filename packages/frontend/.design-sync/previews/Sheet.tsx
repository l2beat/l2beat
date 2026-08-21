import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@l2beat/frontend'

export function SideRight() {
  return (
    <Sheet open modal={false}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Narrow the project list by category, stack and data availability.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 pt-4 text-primary text-sm">
          <div>Category</div>
          <div>DA layer</div>
          <div>Stack</div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function SideLeft() {
  return (
    <Sheet open modal={false}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Jump to a section of the site.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 pt-4 text-primary text-sm">
          <div>Scaling</div>
          <div>Bridges</div>
          <div>Data availability</div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
