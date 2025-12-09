import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'
import { cn } from '~/utils/cn'

type DrawerContextProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DrawerContext = React.createContext<DrawerContextProps | null>(null)

function useDrawer() {
  const context = React.useContext(DrawerContext)
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider.')
  }

  return context
}

function DrawerProvider({
  open,
  setOpen,
  children,
}: React.ComponentProps<'div'> & {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  )
}

const Drawer = ({
  shouldScaleBackground = true,
  open: openProp,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => {
  const [open, setOpen] = React.useState(false)
  return (
    <DrawerProvider open={openProp ?? open} setOpen={onOpenChange ?? setOpen}>
      <DrawerPrimitive.Root
        open={openProp ?? open}
        onOpenChange={onOpenChange ?? setOpen}
        shouldScaleBackground={shouldScaleBackground}
        {...props}
      />
    </DrawerProvider>
  )
}
Drawer.displayName = 'Drawer'

const DrawerTrigger = (
  props: React.ComponentProps<typeof DrawerPrimitive.Trigger>,
) => {
  const { setOpen } = useDrawer()
  return (
    <DrawerPrimitive.Trigger
      {...props}
      onClick={(e) => {
        e.preventDefault()
        setOpen(true)
      }}
    />
  )
}

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
)
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-2xl bg-surface-primary outline-none',
        className,
      )}
      {...props}
    >
      <div className="mx-auto my-4 h-2 w-[100px] shrink-0 rounded-full bg-gray-400 dark:bg-zinc-700" />
      <div className="px-4 pb-4">{children}</div>
    </DrawerPrimitive.Content>
  </DrawerPortal>
)
DrawerContent.displayName = 'DrawerContent'

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('grid gap-1.5', className)} {...props} />
)
DrawerHeader.displayName = 'DrawerHeader'

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
)
DrawerFooter.displayName = 'DrawerFooter'

const DrawerTitle = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      'mb-4 font-bold text-3xl leading-normal tracking-tight',
      className,
    )}
    {...props}
  />
)
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-xs', className)}
    {...props}
  />
)
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
