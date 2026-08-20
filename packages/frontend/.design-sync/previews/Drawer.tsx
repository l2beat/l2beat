import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@l2beat/frontend'

export function Open() {
  return (
    <Drawer open modal={false}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter projects</DrawerTitle>
          <DrawerDescription>
            Pick the categories and stacks you want to compare.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 px-4 pb-6 text-primary text-sm">
          <div>Rollups</div>
          <div>Validiums &amp; Optimiums</div>
          <div>Others</div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
